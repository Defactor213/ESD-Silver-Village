from os import environ
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc, update
from sqlalchemy.orm import relationship
import tracing
import json
import pika

app = Flask('bookings')

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

tracing.setup_tracing(app)

db = SQLAlchemy(app)
CORS(app)

try:
    tracing.channel.exchange_declare(
        exchange='booking_topic', exchange_type='topic', durable=True)
    tracing.channel.queue_declare(queue='booking', durable=True)
    tracing.channel.queue_bind(
        exchange='booking_topic', queue='booking', routing_key='#')
except Exception as e:
    print('Error setting up AMQP', e)


class Seat(db.Model):
    __tablename__ = "seat"
    seatid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    seatrow = db.Column(db.String(1), primary_key=True)
    seatnumber = db.Column(db.Integer, primary_key=True)
    seats = relationship('BookingSeat')

    def __init__(self, seatid, showtimeid, seatrow, seatnumber):
        self.seatid = seatid
        self.seatrow = seatrow
        self.seatnumber = seatnumber

    def json(self):
        return {"seatid": self.seatid, "seatrow": self.seatrow, "seatnumber": self.seatnumber}


class Booking(db.Model):
    __tablename__ = "booking"
    bookingid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    showtimeid = db.Column(db.Integer, primary_key=True)
    transactionid = db.Column(db.String(100))
    userid = db.Column(db.Integer, nullable=False)
    contact = db.Column(db.String(30), nullable=False)
    seats = relationship('BookingSeat', back_populates='booking')

    def __init__(self, showtimeid, userid, contact):
        self.showtimeid = showtimeid
        self.userid = userid
        self.contact = contact

    def json(self):
        return {"bookingid": self.bookingid, "showtimeid": self.showtimeid, "userid": self.userid, "contact": self.contact, "transactionid": self.transactionid}


class BookingSeat(db.Model):
    __tablename__ = 'booking_seat'
    bookingid = db.Column(db.Integer, db.ForeignKey(
        'booking.bookingid'), primary_key=True)
    seatid = db.Column(db.Integer, db.ForeignKey(
        'seat.seatid'), primary_key=True)
    showtimeid = db.Column(db.Integer, primary_key=True)
    booking = relationship('Booking', back_populates='seats')
    seat = relationship('Seat', back_populates='seats')

    def __init__(self, bookingid, seatid, showtimeid):
        self.bookingid = bookingid
        self.seatid = seatid
        self.showtimeid = showtimeid

    def json(self):
        return {"bookingid": self.bookingid, "seatid": self.seatid}


# Get all seats for a particular showtime
@app.route("/bookings/seatings/<string:showtimeid>")
def get_seatings(showtimeid):
    booking_seats = BookingSeat.query.filter_by(showtimeid=showtimeid).all()
    booked_seats_map = {}

    for booking_seat in booking_seats:
        booked_seats_map[booking_seat.seatid] = True

    all_seats = Seat.query.all()
    free_seats = []
    booked_seats = []

    for seat in all_seats:
        if seat.seatid not in booked_seats_map:
            free_seats.append(seat.seatid)
        else:
            booked_seats.append(seat.seatid)

    return jsonify(
        {
            "status": "success",
            "data": {
                "seatings": [seat.json() for seat in all_seats],
                "free_ids": free_seats,
                "booked_ids": booked_seats,
            }
        }
    )


# Get all bookings
@app.route("/bookings")
def get_bookings():
    bookinglist = Booking.query.all()
    return jsonify(
        {
            "status": "success",
            "booking": [booking.json() for booking in bookinglist]
        }
    )


# Get a single booking
@app.route("/bookings/<string:booking_id>", methods=['GET'])
def get_booking(booking_id):
    booking = Booking.query.filter_by(bookingid=booking_id).first()
    if booking is None:
        return jsonify({
            "status": "failure",
            "message": "Not Found",
        }), 404

    booking_seats = booking.seats
    seats = []

    for booking_seat in booking_seats:
        seats.append(booking_seat.seat)

    return jsonify(
        {
            "status": "success",
            "data": {
                "booking": booking.json(),
                "seats": [seat.json() for seat in seats]
            }
        }
    )


@app.route("/bookings", methods=["POST"])
def create_booking():
    user_id = request.headers['X-Consumer-Custom-Id']

    data = request.get_json()

    showtime_id = data['showtime_id']
    contact = data['contact']

    booking = Booking(showtimeid=showtime_id, userid=user_id, contact=contact)

    # Create booking
    try:
        db.session.add(booking)
        db.session.commit()
    except exc.IntegrityError:
        return jsonify({
            "status": "failure",
            "message": "You already have a booking for this showtime"
        }), 400
    except Exception as e:
        print('failure', e)

        return jsonify(
            {
                "status": "failure",
                "message": "An error occurred creating the booking."
            }
        ), 500

    # Create seat associations
    try:
        for seatid in data['seat_ids']:
            booking_seat = BookingSeat(booking.bookingid, seatid, showtime_id)

            db.session.add(booking_seat)

        db.session.commit()
    except Exception as e:
        print(e)

        try:
            db.session.delete(booking)
            db.session.commit()
        except:
            pass

        return jsonify(
            {
                "status": "failure",
                "message": "An error occurred creating the booking."
            }
        ), 500

    message = json.dumps({
        "data": {
            "booking_id": booking.bookingid,
        }
    })

    try:
        tracing.channel.basic_publish(exchange="booking_topic", routing_key="booking.created",
                                      body=message, properties=pika.BasicProperties(content_type="application/json", delivery_mode=2))
    except Exception as e:
        print(e)

    return jsonify(
        {
            "status": "success",
            "data": booking.json()
        }
    ), 201


# update a booking's transaction_id
@app.route("/bookings/<string:bookingid>/transaction_id", methods=["PUT"])
def put_booking_transactionid(bookingid):
    if not request.is_json:
        return jsonify({
            "status": "failure",
            "message": "Bad Request"
        }), 400

    data = request.get_json()

    try:
        result = db.session.execute(
            update(Booking).
            where(Booking.bookingid == bookingid).
            values(transactionid=data['transaction_id'])
        )
        db.session.commit()

        if result.rowcount == 0:
            return jsonify({
                "status": "failure",
                "message": "Not Found"
            }), 404
    except Exception as e:
        print(e)
        return jsonify({
            "status": "failure",
            "message": "Error updating booking"
        }), 500

    return jsonify({
        "status": "success",
        "message": "Transaction ID updated"
    }), 204

# Delete booking


@app.route("/bookings/<string:bookingid>", methods=["DELETE"])
def delete_booking(bookingid):
    booking = Booking.query.filter_by(bookingid=bookingid).first()

    if booking is None:
        return jsonify(
            {
                "status": "failure",
                "message": "Invalid booking"
            }
        ), 404

    try:
        db.session.delete(booking)
        db.session.commit()
    except:
        return jsonify(
            {
                "status": "failure",
                "message": "Error deleting booking"
            }
        ), 500

    return jsonify(
        {
            "status": "success",
            "message": "Booking deleted"
        }
    ), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

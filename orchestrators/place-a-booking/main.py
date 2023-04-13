from flask import Flask, request, jsonify, redirect

import os

import requests

import tracing
import pika
import redis
import json

redis_url = os.environ.get('REDIS_URL')

redis_conn = redis.Redis.from_url(redis_url)

app = Flask('place-a-booking')

tracing.setup_tracing(app)

booking_URL = ""
create_checkout_URL = "http://payments:5000/create-checkout-session"
transaction_success_URL = "http://payments:5000/payment_sessions"

booking_URL = "http://bookings:5000/bookings"
seat_URL = "http://bookings:5000/bookings/seat"
payment_URL = ""
auth_users_url = 'http://auth:8080/users'
movies_url = 'http://movies:5000/movies'
showtime_url = 'http://showtime:5000/showtimes'


def send_confirmation_email(display_name: str, email: str, movie_title: str, movie_showtime: str, movie_seat: str):
    message = json.dumps({
        "recipient": email,
        "template": "booking-success",
        "data": {
            "display_name": display_name,
            "movie_title": movie_title,
            "movie_showtime": movie_showtime,
            "movie_seat": movie_seat,
        }
    })

    tracing.channel.basic_publish(exchange="notification_topic", routing_key="notification.confirm_booking",
                                  body=message, properties=pika.BasicProperties(content_type="application/json", delivery_mode=2))


@app.route("/place-a-booking", methods=["POST"])
def place_a_booking():

    request_headers = {}

    for k, v in request.headers:
        if k.startswith('X-B3') or k.startswith('X-Consumer'):
            request_headers[k] = v

    if not request.is_json:
        return jsonify({
            "status": "failure",
            "message": "Bad Request",
        }), 400

    payload = request.get_json()
    print("\nReceived request in JSON:", payload)

    print('\n\n-----Invoking booking microservice-----')
    create_booking_request = requests.request(
        'POST', booking_URL, json=payload, headers=request_headers)
    create_booking_response = create_booking_request.json()

    if not create_booking_request.ok:
        return jsonify({
            "status": "failure",
            "message": create_booking_response['message'],
        }), create_booking_request.status_code

    # payment stuff: stripe
    create_checkout_session_request = requests.request(
        'POST', create_checkout_URL, headers=request_headers)
    create_checkout_session_response = create_checkout_session_request.json()

    if not create_checkout_session_request.ok:
        return jsonify({
            "status": "failure",
            "message": create_checkout_session_request['message'],
        }), create_checkout_session_request.status_code

    redis_conn.set(create_checkout_session_response['data']['id'],
                   create_booking_response['data']['bookingid'])
    return jsonify(create_checkout_session_response['data']['url'])


@app.route("/place-a-booking-success")
def place_a_booking_success():
    user_id = request.headers.get('X-Consumer-Custom-ID')

    # Pass Zipkin headers in call
    request_headers = {}

    for k, v in request.headers:
        if k.startswith('X-B3') or k.startswith('X-Consumer'):
            request_headers[k] = v

    session_id = request.args.get("session_id")
    booking_id = redis_conn.get(session_id)

    if booking_id is None:
        return jsonify({
            "status": "failure",
            "message": "Invalid session ID"
        })

    payment_status_request = requests.request('GET', "%s/%s/payment_status" % (
        transaction_success_URL, session_id), headers=request_headers)
    payment_status_response = payment_status_request.json()

    if not payment_status_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error contacting payment service"
        }), 500

    if payment_status_response['data']['payment_status'] != 'paid':
        return jsonify({
            "status": "failure",
            "message": "Unpaid"
        }), 400

    # Validate that the booking exists
    booking_request = requests.request(
        'GET', "%s/%d" % (booking_URL, int(booking_id)), headers=request_headers)
    if not booking_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Valid session ID but invalid booking ID"
        }), 404

    booking_response = booking_request.json()

    payload = {
        "transaction_id": session_id,
    }
    booking_transaction_id_update_request = requests.request(
        'PUT', "%s/%d/transaction_id" % (booking_URL, int(booking_id)), json=payload, headers=request_headers)
    if not booking_transaction_id_update_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error updating transaction ID"
        }), 500

    user_request = requests.request(
        'GET', "%s/%s" % (auth_users_url, user_id), headers=request_headers)
    if not user_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error fetching user"
        })

    user_response = user_request.json()

    showtime_request = requests.request(
        'GET', "%s/%s" % (showtime_url, booking_response['data']['booking']['showtimeid']), headers=request_headers)
    if not showtime_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Invalid showtime"
        })

    showtime_response = showtime_request.json()

    movie_request = requests.request(
        'GET', "%s/%s" % (movies_url, showtime_response['data']['movieId']), headers=request_headers)
    if not movie_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error requesting movie"
        })
    movie_response = movie_request.json()

    seats = booking_response['data']['seats']
    seats_texts = []

    for seat in seats:
        seats_texts.append("%s%d" % (seat['seatrow'], seat['seatnumber']))

    try:
        print('Publishing AMQP message')
        send_confirmation_email(
            user_response['user']['display_name'],
            user_response['user']['email'],
            movie_response['data']['title'],
            showtime_response['data']['start'],
            ', '.join(seats_texts),
        )
    except Exception as e:
        print('Error Publishing AMQP message')
        print(e)

    return redirect("http://localhost:3000/bookings/%d" % int(booking_id))


def processPlaceABooking(booking_detail, request_headers):
    # invokes bookings microservice (booking table)
    print('\n\n-----Invoking booking microservice-----')
    booking_request = requests.request(
        'POST', booking_URL, json=booking_detail, headers=request_headers)
    booking_response = booking_request.json()

    if not booking_request.ok:
        raise Exception('create booking request unsuccessful')

    print("booking_result:", booking_response, '\n')

    return booking_response['data']


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

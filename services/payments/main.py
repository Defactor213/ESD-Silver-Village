from os import environ
from sre_constants import SUCCESS
from flask import Flask, redirect, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import tracing
import stripe

app = Flask('payments')

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

tracing.setup_tracing(app)

db = SQLAlchemy(app)

stripe.api_key = environ.get('STRIPE_KEY')

mt = stripe.Product.create(name="movie ticket")

mt_p = stripe.Price.create(
    unit_amount=1000,
    currency="sgd",
    product=mt.id,
)

frontend_url = 'http://localhost:3000'
root_url = environ.get('ROOT_URL')


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': mt_p.id,
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url="%s/place-a-booking-success?session_id={CHECKOUT_SESSION_ID}" % root_url,
            # add booking_id
            cancel_url="%s/cancel" % frontend_url,
        )

    except Exception as e:
        return str(e)

    return jsonify({
        "status": "success",
        "data": {
            "url": checkout_session.url,
            "id": checkout_session.id
        }
    })


@app.route('/payment_sessions/<string:session_id>/payment_status', methods=['GET'])
def get_session(session_id):
    status = stripe.checkout.Session.retrieve(session_id).payment_status
    return jsonify({
        "status": "success",
        "data": {
            "payment_status": status
        }
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify

import requests
import tracing

app = Flask('add-a-showtime')

tracing.setup_tracing(app)

showtime_URL = "http://showtime:5000/showtimes"
movies_URL = "http://movies:5000/movies"


@app.route("/add-a-showtime", methods=["POST"])
def add_a_showtime():
    # Pass Zipkin headers in call
    request_headers = {}

    for k, v in request.headers:
        if k.startswith('X-B3'):
            request_headers[k] = v

        if not request.is_json:
            # if reached here, not a JSON request.
            return jsonify({
                "status": "failure",
                "message": "Invalid JSON input: " + str(request.get_data())
            }), 400

        payload = request.get_json()

        movie_id = payload['movieId']

        movie_request = requests.request(
            'GET', "%s/%s" % (movies_URL, movie_id), headers=request_headers)
        if not movie_request.ok:
            return {
                "status": "failure",
                "message": "Movie not found",
            }

        # Invoke the showtime microservice
        print('\n\n-----Invoking showtime microservice-----')
        create_showtime_request = requests.request(
            'POST', showtime_URL, json=payload, headers=request_headers)
        create_showtime_response = create_showtime_request.json()

        print("create_showtime_request", create_showtime_response, '\n')

        # Check the showtime result;
        # if a failure, show error message.
        if not create_showtime_request.ok:
            return {
                "status": "failure",
                "message": create_showtime_response['message']
            }, 400

        # Return showtime record
        return {
            "status": "success",
            "data": {
                "showtime_result": create_showtime_response['showtime']
            }
        }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

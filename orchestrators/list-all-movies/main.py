import json
from flask import Flask, request, jsonify
import tracing

import requests

app = Flask('list-all-movies')

tracing.setup_tracing(app)

movies_url = "http://movies:5000/movies"


@app.route("/list-all-movies")
def getMovies():
    # Pass Zipkin headers in call
    request_headers = {}

    for k, v in request.headers:
        if k.startswith('X-B3'):
            request_headers[k] = v

    movies_request = requests.request(
        'GET', movies_url, headers=request_headers)
    movies_response = movies_request.json()

    if not movies_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error reaching movies service",
        })

    movie_list = movies_response["data"]["movies"]
    for movie in movie_list:
        movie_score_request = requests.request('GET',
                                               "http://rating:5000/score?movie_title=%s" % movie.get('title'))

        if movie_score_request.ok:
            movie_score_response = movie_score_request.json()
            movie["score"] = movie_score_response['data']['score']

    return jsonify({
        "status": "success",
        "data": {
            "movies": movie_list
        }
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

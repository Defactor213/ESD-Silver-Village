from flask import Flask, request, jsonify
import tracing
import requests

app = Flask('movie-details')

tracing.setup_tracing(app)


@app.route("/movie-details/<string:movie_id>")
def get_movie_details(movie_id):
    # Pass Zipkin headers in call
    request_headers = {}

    for k, v in request.headers:
        if k.startswith('X-B3'):
            request_headers[k] = v

    movie_request = requests.request(
        'GET', "http://movies:5000/movies/" + movie_id, headers=request_headers)
    movie_response = movie_request.json()

    if not movie_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error fetching movie details"
        }), 500

    author = "author"
    content = "content"
    created_at = "created_at"

    movie_dict = movie_response["data"]
    ratings_request = requests.request(
        'GET', "http://rating:5000/rating?movie_title=%s" % movie_dict['title'], headers=request_headers)
    ratings_response = ratings_request.json()

    if not ratings_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error fetching ratings details"
        }), 500

    movie_dict['ratings'] = ratings_response['data']['results']

    score_request = requests.request(
        'GET', "http://rating:5000/score?movie_title=%s" % movie_dict['title'], headers=request_headers)
    score_response = score_request.json()

    if not score_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error fetching score details"
        }), 500

    movie_dict['score'] = score_response['data']['score']

    trailers_request = requests.request(
        'GET', "http://trailer:5000/trailer?movie_title=%s" % movie_dict['title'], headers=request_headers)
    trailers_response = trailers_request.json()

    if not trailers_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error fetching trailers details"
        }), 500

    movie_dict['trailers'] = trailers_response['data']['results']

    showtime_request = requests.request(
        'GET', "http://showtime:5000/showtimes?movieId=" + movie_id, headers=request_headers)
    showtime_result = showtime_request.json()

    if not showtime_request.ok:
        return jsonify({
            "status": "failure",
            "message": "Error fetching showtime details"
        }), 500

    movie_dict["showtimes"] = showtime_result["data"]

    return movie_dict


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

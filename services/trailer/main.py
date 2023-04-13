from flask import Flask, request, jsonify
import tracing
import os
import requests
import json
import redis

redis_url = os.environ.get('REDIS_URL')

redis_conn = redis.Redis.from_url(redis_url)

app = Flask('trailer')

tracing.setup_tracing(app)

tmdb_api_key = os.environ.get('TMDB_API_KEY')

if tmdb_api_key is None:
    print("WARNING, MISSING TMDB API KEY")


@app.route("/trailer")
def get_trailer():
    movie_title = request.args.get('movie_title')

    if movie_title == None:
        return jsonify({
            "status": "invalid"
        }), 400

    cached_trailers = redis_conn.get("trailers.%s" % movie_title)
    if cached_trailers is not None:
        try:
            cached_trailers_parsed = json.loads(cached_trailers)

            return {
                "status": "success",
                "data": {
                    "results": cached_trailers_parsed
                }
            }
        except:
            pass

    params = {
        "api_key": tmdb_api_key,
        "query": movie_title,
    }

    tmdb_movie_request = requests.request(
        'GET', 'https://api.themoviedb.org/3/search/movie', params=params)

    if not tmdb_movie_request.ok:
        return jsonify(
            {
                "status": "failure",
                "message": "Error contacting external service"
            }
        )

    tmdb_movie_response = tmdb_movie_request.json()

    results = tmdb_movie_response['results']
    if len(results) == 0:
        return jsonify({
            "status": "invalid",
            "message": "No movie results",
        }), 404

    params = {
        "api_key": tmdb_api_key,
    }

    url = "https://api.themoviedb.org/3/movie/%d/videos" % results[0]['id']

    tmdb_movie_videos_request = requests.request('GET', url, params=params)
    if not tmdb_movie_videos_request.ok:
        return jsonify(
            {
                "status": "failure",
                "message": "Error contacting external service"
            }
        )

    response_body_dict = tmdb_movie_videos_request.json()

    trailers = []

    for trailer in response_body_dict["results"]:
        trailer = {
            "name": trailer["name"],
            "key": trailer["key"],
            "site": trailer["site"],
            "type": trailer["type"],
        }

        trailers.append(trailer)

    redis_conn.set("trailers.%s" % movie_title, json.dumps(trailers))

    return {
        "status": "success",
        "data": {
            "results": trailers
        }
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

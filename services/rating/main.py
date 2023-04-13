from flask import Flask, request, jsonify
from os import environ
import tracing
import os
import urllib.request
from flask import request
import json
import redis

redis_url = os.environ.get('REDIS_URL')

redis_conn = redis.Redis.from_url(redis_url)

app = Flask('rating')

tracing.setup_tracing(app)

tmdb_api_key = os.environ.get('TMDB_API_KEY')

if tmdb_api_key is None:
    print("WARNING, MISSING TMDB API KEY")


@app.route("/rating")
def get_ratings():
    movie_title = request.args.get('movie_title')

    if movie_title == None:
        return jsonify({
            "status": "invalid"
        }), 400

    cached_ratings = redis_conn.get("ratings.%s" % movie_title)
    if cached_ratings is not None:
        try:
            cached_ratings_parsed = json.loads(cached_ratings)

            return {
                "status": "success",
                "data": {
                    "results": cached_ratings_parsed
                }
            }
        except:
            pass

    params = urllib.parse.urlencode({
        "api_key": tmdb_api_key,
        "query": movie_title,
    })

    url = "https://api.themoviedb.org/3/search/movie?%s" % params

    response = urllib.request.urlopen(url)
    response_body = response.read()
    response_body_dict = json.loads(response_body)

    results = response_body_dict['results']
    if len(results) == 0:
        return jsonify({
            "status": "invalid",
            "message": "No movie results",
        }), 404

    params = urllib.parse.urlencode({
        "api_key": tmdb_api_key,
    })

    url = "https://api.themoviedb.org/3/movie/%d/reviews?%s" % (
        results[0]['id'], params)
    response = urllib.request.urlopen(url)
    response_body = response.read()
    response_body_dict = json.loads(response_body)

    ratings = []

    for rating in response_body_dict["results"]:
        rating = {
            "author": rating['author'],
            "author_avatar_path": rating['author_details']['avatar_path'],
            "content": rating["content"],
            "stars": rating["author_details"]["rating"],
        }

        ratings.append(rating)

    redis_conn.set("ratings.%s" % movie_title, json.dumps(ratings))

    return {
        "status": "success",
        "data": {
            "results": ratings
        }
    }


@app.route("/score")
def get_score():
    movie_title = request.args.get('movie_title')

    if movie_title == None:
        return jsonify({
            "status": "invalid"
        }), 400

    cached_score = redis_conn.get("score.%s" % movie_title)
    if cached_score is not None:
        score = float(cached_score)

        return jsonify({
            "status": "success",
            "data": {
                "score": score,
            }
        })

    params = urllib.parse.urlencode({
        "api_key": tmdb_api_key,
        "query": movie_title,
    })

    url = "https://api.themoviedb.org/3/search/movie?%s" % params

    response = urllib.request.urlopen(url)
    response_body = response.read()
    response_body_dict = json.loads(response_body)

    results = response_body_dict['results']
    if len(results) == 0:
        return jsonify({
            "status": "no results"
        }), 204

    score = results[0]['vote_average']

    redis_conn.set("score.%s" % movie_title, score)

    return jsonify({
        "status": "success",
        "data": {
            "score": score,
        }
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from datetime import date
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask.json import JSONEncoder
from os import environ
import tracing

app = Flask('movies')

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

tracing.setup_tracing(app)

db = SQLAlchemy(app)

CORS(app)


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.isoformat()
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)

        return JSONEncoder.default(self, obj)


app.json_encoder = CustomJSONEncoder


class Movie(db.Model):
    __tablename__ = 'movie'

    movie_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    director = db.Column(db.String(256), nullable=False)
    cast = db.Column(db.String(1024), nullable=False)
    synopsis = db.Column(db.String, nullable=False)
    genre = db.Column(db.String(256), nullable=False)
    duration_min = db.Column(db.Integer, nullable=False)
    poster = db.Column(db.String(256), nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    rating = db.Column(db.String(256), nullable=False)
    language = db.Column(db.String(256), nullable=False)

    def __init__(self, title, director, cast, synopsis, genre, duration_min, poster, release_date, rating, language):
        self.title = title
        self.director = director
        self.cast = cast
        self.synopsis = synopsis
        self.genre = genre
        self.duration_min = duration_min
        self.poster = poster
        self.release_date = release_date
        self.rating = rating
        self.language = language

    def json(self):
        return {"movie_id": self.movie_id, "title": self.title, "director": self.director, "cast": self.cast, "synopsis": self.synopsis, "genre": self.genre, "duration_min": self.duration_min, "poster": self.poster, "release_date": self.release_date, "rating": self.rating, "language": self.language}


@app.route("/movies")
def get_all():
    movielist = Movie.query.all()
    return jsonify(
        {
            "status": "success",
            "data": {
                "movies": [movie.json() for movie in movielist]
            }
        }
    )


@app.route("/movies/<int:movie_id>")
def find_by_id(movie_id):
    movie = Movie.query.filter_by(movie_id=movie_id).first()
    if movie is None:
        return jsonify(
            {
                "status": "failure",
                "message": "Movie not found"
            }
        ), 404

    return jsonify(
        {
            "status": "success",
            "data": movie.json()
        }
    )


# Add Movie
@app.route("/movies", methods=['POST'])
def create_movie():
    data = request.get_json()

    if not "title" in data:
        return jsonify(
            {
                "status": "failure",
                "message": "Bad Request"
            },
        )

    if (Movie.query.filter_by(title=data['title']).first()):
        return jsonify(
            {
                "status": "failure",
                "data": {
                    "title": data['title']
                },
                "message": "Movie already exists."
            }
        ), 400

    movie = Movie(**data)

    try:
        db.session.add(movie)
        db.session.commit()
    except:
        return jsonify(
            {
                "status": "failure",
                "data": {
                    "title": data['title']
                },
                "message": "An error occurred while creating the movie."
            }
        ), 500

    return jsonify(
        {
            "status": "success",
            "data": movie.json()
        }
    ), 201


# Update Movie
@app.route("/movies/<string:movie_id>", methods=['PUT'])
def update_book(movie_id):
    movie = Movie.query.filter_by(movie_id=movie_id).first()
    if movie:
        data = request.get_json()
        if data['title']:
            movie.title = data['title']
        if data['director']:
            movie.director = data['director']
        if data['cast']:
            movie.cast = data['cast']
        if data['synopsis']:
            movie.synopsis = data['synopsis']
        if data['genre']:
            movie.genre = data['genre']
        if data['duration_min']:
            movie.duration_min = data['duration_min']
        if data['poster']:
            movie.poster = data['poster']
        if data['release_date']:
            movie.release_date = data['release_date']
        if data['rating']:
            movie.rating = data['rating']
        if data['language']:
            movie.language = data['language']
        db.session.commit()
        return jsonify(
            {
                "status": "success",
                "data": movie.json()
            }
        )
    return jsonify(
        {
            "status": "failure",
            "data": {
                "movie_id": movie_id
            },
            "message": "Movie not found."
        }
    ), 404


# Delete Movie
@app.route("/movies/<string:movie_id>", methods=['DELETE'])
def delete_book(movie_id):
    movie = Movie.query.filter_by(movie_id=movie_id).first()
    if movie:
        db.session.delete(movie)
        db.session.commit()
        return jsonify(
            {
                "status": "success",
                "data": {
                    "movie_id": movie_id
                }
            }
        )
    return jsonify(
        {
            "status": "failure",
            "data": {
                "movie_id": movie_id
            },
            "message": "Movie not found."
        }
    ), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

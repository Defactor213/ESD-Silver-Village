import moment from 'moment';
import React, { useEffect, useState } from 'react';

import MovieGrid from './MovieGrid';
import Spinner from './Spinner';

interface Props {
  type: 'now_showing' | 'coming_soon';
}

const MovieTab: React.FC<Props> = function (props) {
  const { type } = props;

  const [movies, setMovies] = useState<SilverVillage.Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);

      const resp = await fetch('http://localhost:8000/list-all-movies'); //must call orchestrator
      const data = await resp.json();

      const movies: SilverVillage.Movie[] = data.data.movies;

      const now = moment();

      switch (type) {
        case 'now_showing': {
          setMovies(
            movies.filter((movie) =>
              moment(movie.release_date).isSameOrBefore(now)
            )
          );
          break;
        }
        case 'coming_soon': {
          setMovies(
            movies.filter((movie) => moment(movie.release_date).isAfter(now))
          );
          break;
        }
      }
      setLoading(false);
    }
    fetchMovies();
  }, [type]);

  if (loading) {
    return <Spinner />;
  }

  return <MovieGrid movies={movies} />;
};

export default MovieTab;

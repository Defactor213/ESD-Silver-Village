import React from 'react';
import styled from 'styled-components';

import Movie from './components/Movie';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  justify-content: space-around;
  column-gap: 20px;
  row-gap: 20px;
`;

interface Props {
  movies: SilverVillage.Movie[];
}

const MovieGrid: React.FC<Props> = function (props) {
  const { movies } = props;

  if (movies.length === 0) {
    return <span className="text-secondary">No movies to display</span>;
  }

  return (
    <Grid>
      {movies.map((movie) => (
        <Movie key={movie.title} movie={movie} />
      ))}
    </Grid>
  );
};

export default MovieGrid;

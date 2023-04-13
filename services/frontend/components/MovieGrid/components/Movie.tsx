import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 300px;
`;

const Metadata = styled.div`
  margin-top: 20px;
`;

const MetadataRow = styled.div`
  display: flex;
  align-items: center;
  color: var(--bs-secondary);
`;

const Star = styled.span`
  color: var(--bs-yellow);
`;

interface Props {
  movie: SilverVillage.Movie;
}

const Movie: React.FC<Props> = function (props) {
  const { movie } = props;

  if (movie.score == 0) {
    movie.score = 'To be rated';
  }

  return (
    <Container className="rounded border border-secondary bg-secondary">
      <span>
        <a href={`/watch/${movie.movie_id}`}>
          <img src={movie.poster} width="200" height="300"></img>
        </a>
      </span>
      <Metadata>
        <h5 className="fw-bold text-primary">{movie.title}</h5>
        <MetadataRow>
          <span>{moment(movie.release_date).format('YYYY')}</span>
          &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          <span>{movie.language}</span>
        </MetadataRow>
        <MetadataRow>
          <Star>✭&nbsp;</Star>
          <span>{movie.score}</span>
        </MetadataRow>
      </Metadata>
    </Container>
  );
};

export default Movie;

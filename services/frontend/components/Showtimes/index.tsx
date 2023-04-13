import React from 'react';

import Showtime from './components/Showtime';
import { ShowtimesList, Wrapper } from './styled';

interface Props {
  showtimes: SilverVillage.Showtime[];
}

const Showtimes: React.FC<Props> = function (props) {
  const { showtimes } = props;

  if (showtimes.length === 0) {
    return (
      <span className="fs-5 text-secondary">
        There are no showtimes for this movie.
      </span>
    );
  }

  return (
    <Wrapper>
      <h1>Screenings</h1>
      <ShowtimesList>
        {showtimes.map((showtime) => (
          <a
            key={showtime.id}
            href={`/watch/${showtime.movieId}/showtimes/${showtime.id}`}
          >
            <Showtime showtime={showtime} />
          </a>
        ))}
      </ShowtimesList>
    </Wrapper>
  );
};

export default Showtimes;

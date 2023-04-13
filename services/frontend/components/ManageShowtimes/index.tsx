import moment from 'moment';
import React, { useMemo, useState } from 'react';

import Spinner from '../Spinner';
import Showtime from './components/Showtime';
import { Button, Field, Input, Section, SectionTitle, Wrapper } from './styled';

const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

interface Props {
  movie: SilverVillage.Movie;
}

const ManageShowtimes: React.FC<Props> = function (props) {
  const { movie } = props;

  const [showtimes, setShowtimes] = useState(movie.showtimes);
  const [start, setStart] = useState(moment().startOf('hour'));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const end = useMemo(() => {
    return start.clone().add(movie.duration_min, 'minutes');
  }, [movie.duration_min, start]);

  function handleStartChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsedMoment = moment(e.target.value);

    setStart(parsedMoment);
  }

  async function fetchShowtimes() {
    const resp = await fetch(
      `${process.env.API_ROOT}/showtimes?movieId=${movie.movie_id}`
    );
    const data = await resp.json();

    setShowtimes(data.data);
  }

  function handleButtonClick(e: React.MouseEvent) {
    setLoading(true);
    setError(null);

    async function submit() {
      try {
        const resp = await fetch(`${process.env.API_ROOT}/add-a-showtime`, {
          method: 'POST',
          body: JSON.stringify({
            movieId: movie.movie_id,
            start: start.toISOString(),
            end: end.toISOString(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await resp.json();

        if (!resp.ok) {
          setError(data.message ?? resp.statusText);
        }
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
      fetchShowtimes();
    }

    submit();
  }

  async function handleShowtimeDelete(showtimeId: number) {
    await fetch(`${process.env.API_ROOT}/showtimes/${showtimeId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    fetchShowtimes();
  }

  return (
    <Wrapper>
      <h1>Manage Showtimes</h1>

      <Section>
        <SectionTitle>Current Showtimes</SectionTitle>
        {showtimes.length === 0 && (
          <span className="text-secondary">There are no showtimes.</span>
        )}
        <ul>
          {showtimes.map((showtime) => (
            <Showtime
              key={showtime.id}
              showtime={showtime}
              onDelete={handleShowtimeDelete}
            />
          ))}
        </ul>
      </Section>

      <Section>
        <SectionTitle>Add Showtime</SectionTitle>
        <Field>
          Start Date/Time
          <Input
            type="datetime-local"
            value={start.format(DATETIME_FORMAT)}
            onChange={handleStartChange}
          />
        </Field>
        <label>
          End Time (computed)
          <Input
            type="datetime-local"
            value={end.format(DATETIME_FORMAT)}
            disabled
          />
        </label>
        {loading ? (
          <Spinner />
        ) : (
          <Button onClick={handleButtonClick}>Add</Button>
        )}
        {error != null && <span className="text-danger">Error: {error}</span>}
      </Section>
    </Wrapper>
  );
};

export default ManageShowtimes;

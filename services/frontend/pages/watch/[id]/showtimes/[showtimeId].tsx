import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import Layout from '../../../../components/Layout';
import Navbar from '../../../../components/Navbar';
import Seatings from '../../../../components/Seatings';
import Spinner from '../../../../components/Spinner';
import useAuth from '../../../../hooks/useAuth';

const Poster = styled.img`
  width: 100%;
`;

const SingleMovieShowtimePage: React.FC = function () {
  const router = useRouter();

  const { data: authData, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authData == null) {
      router.push('/login');
    }
  }, [authData, authLoading, router]);

  const { id: movieId, showtimeId } = router.query;

  const [movie, setMovie] = useState<SilverVillage.Movie | null>(null);
  const [showtime, setShowtime] = useState<SilverVillage.Showtime | null>(null);
  const [seatings, setSeatings] = useState<{
    seatings: SilverVillage.Seating[];
    free_ids: SilverVillage.Seating['seatid'][];
    booked_ids: SilverVillage.Seating['seatid'][];
  } | null>(null);

  const [chosenSeatIds, setChosenSeatIds] = useState<
    Set<SilverVillage.Seating['seatid']>
  >(new Set());

  useEffect(() => {
    if (movieId == null || showtimeId == null) {
      return;
    }

    async function fetchMovie() {
      const resp = await fetch(`${process.env.API_ROOT}/movies/${movieId}`);

      const data = await resp.json();

      setMovie(data.data);
    }

    fetchMovie();

    async function fetchShowtime() {
      const resp = await fetch(
        `${process.env.API_ROOT}/showtimes/${showtimeId}`
      );

      const data = await resp.json();

      setShowtime(data.data);
    }
    fetchShowtime();

    async function fetchSeatings() {
      const resp = await fetch(
        `${process.env.API_ROOT}/bookings/seatings/${showtimeId}`
      );

      const data = await resp.json();

      setSeatings(data.data);
    }

    fetchSeatings();
  }, [movieId, showtimeId]);

  const handleCheckoutClick = useCallback<React.MouseEventHandler>(() => {
    async function checkout() {
      if (authData == null || showtime == null || chosenSeatIds == null) {
        return;
      }

      setLoading(true);
      setError(null);

      const resp = await fetch(`${process.env.API_ROOT}/place-a-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: authData.email ?? '',
          seat_ids: Array.from(chosenSeatIds),
          showtime_id: showtime.id,
        }),
        credentials: 'include',
      });
      const data = await resp.json();

      setLoading(false);

      if (resp.ok) {
        window.location.href = data;
      } else {
        setError(data['message']);
      }
    }
    checkout();
  }, [authData, chosenSeatIds, showtime]);

  return (
    <Layout>
      <Navbar />
      <div className="container py-4">
        {movie == null || showtime == null ? (
          <Spinner />
        ) : (
          <>
            <div className="row">
              <div className="col-2">
                <Poster src={movie.poster} alt="Movie poster" />
              </div>
              <div className="col-10 d-flex flex-column">
                <h1 className="text-primary">Showtime for {movie.title}</h1>
                <p className="text-secondary">
                  {moment(showtime.start).format('llll')}
                  &nbsp;to&nbsp;
                  {moment(showtime.end).format('llll')}
                </p>
              </div>
            </div>

            <div className="row">
              {seatings != null ? (
                <Seatings
                  seatings={seatings.seatings}
                  freeIds={new Set(seatings.free_ids)}
                  bookedIds={new Set(seatings.booked_ids)}
                  chosenSeatIds={chosenSeatIds}
                  onChosenSeatsChange={setChosenSeatIds}
                />
              ) : (
                <Spinner />
              )}

              {chosenSeatIds.size > 0 ? (
                <button
                  className="btn btn-primary mt-4"
                  onClick={handleCheckoutClick}
                >
                  Checkout
                </button>
              ) : (
                <p className="text-secondary mt-2">
                  Select at least one seat to continue
                </p>
              )}

              {loading && <Spinner />}
              {error && <span className="text-danger">{error}</span>}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SingleMovieShowtimePage;

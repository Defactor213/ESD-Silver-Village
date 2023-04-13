import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import Layout from '../../../components/Layout';
import ManageShowtimes from '../../../components/ManageShowtimes';
import Navbar from '../../../components/Navbar';
import Showtimes from '../../../components/Showtimes';
import Spinner from '../../../components/Spinner';
import useAuth from '../../../hooks/useAuth';

const Wrapper = styled.div`
  position: relative;

  z-index: 1;
`;

const MetadataList = styled.div`
  display: flex;

  column-gap: 20px;
  color: var(--bs-secondary);
`;

const Metadata = styled.div`
  display: flex;
  align-items: center;

  column-gap: 5px;
`;

const Poster = styled.img`
  width: 100%;
`;

const Trailer = styled.iframe`
  margin-top: 20px;
  width: 400px;
  height: 225px;
`;

const TMDBLogo = styled.img.attrs({
  src: '/logo_tmdb.svg',
})`
  width: 30px;
`;

const SingleMoviePage: React.FC = function () {
  const router = useRouter();

  const { data: authData } = useAuth();

  const movieID = router.query.id;
  const [movie, setMovie] = useState<SilverVillage.Movie | null>(null);

  useEffect(() => {
    if (movieID == null) {
      return;
    }
    async function run() {
      const resp = await fetch(
        `http://localhost:8000/movie-details/${movieID}`
      );
      const data = await resp.json();
      setMovie(data);

      if (data == null) {
        router.push('/404');
      }
    }

    run();
  }, [movieID, router]);

  const trailer = useMemo(() => {
    if (movie == null) {
      return null;
    }

    return (
      movie.trailers.find(
        (trailer) => trailer.type === 'Trailer' && trailer.site === 'YouTube'
      ) ?? null
    );
  }, [movie]);

  return (
    <Layout>
      <Navbar />

      <Wrapper className="container py-4">
        {movie != null ? (
          <>
            <div className="row">
              <div className="col-3">
                <Poster src={movie.poster} alt="Movie poster" />
              </div>
              <div className="col-9">
                <p className="fs-1 text-primary">{movie.title}</p>
                <p className="fs-6 text-secondary">{movie.synopsis}</p>

                <MetadataList>
                  <Metadata>
                    <TMDBLogo />
                    <span>{movie.score}</span>
                  </Metadata>

                  <Metadata>⏱ {movie.duration_min} mins</Metadata>

                  <Metadata>
                    {new Date(movie.release_date).getFullYear()}
                  </Metadata>

                  <Metadata>{movie.genre}</Metadata>
                </MetadataList>

                {trailer != null && (
                  <Trailer
                    src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            <div className="row mt-3">
              {authData?.role === 'manager' ? (
                <ManageShowtimes movie={movie} />
              ) : (
                <Showtimes showtimes={movie.showtimes} />
              )}
            </div>
          </>
        ) : (
          <Spinner />
        )}

        <div className="row">
          {authData == null && <span>Log in to book a screening</span>}
        </div>
      </Wrapper>
    </Layout>
  );
};

export default SingleMoviePage;

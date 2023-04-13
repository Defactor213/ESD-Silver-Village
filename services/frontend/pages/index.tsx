import classNames from 'classnames';
import type { NextPage } from 'next';
import { useState } from 'react';

import Layout from '../components/Layout';
import MovieTab from '../components/MovieTab';
import Navbar from '../components/Navbar';
import Promotion from '../components/Promotion';

const Home: NextPage = () => {
  const [tab, setTab] = useState<'now_showing' | 'coming_soon'>('now_showing');

  return (
    <Layout>
      <Navbar />

      <div
        id="promoCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#promoCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />
          <button
            type="button"
            data-bs-target="#promoCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          />
          <button
            type="button"
            data-bs-target="#promoCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          />
        </div>
        <div className="carousel-inner">
          <Promotion
            imageSrc="https://preview.redd.it/oqduw7io0o281.jpg?auto=webp&s=ad3e9f96d15f49646043e7031858896180f51c63"
            title="Free Poster with SPIDER MAN: NO WAY HOME"
            description="Purchase your tickets in IMAX and receive an exclusive poster, while supplies last."
            active
          />
          <Promotion
            imageSrc="https://preview.redd.it/6092ltrt8nt71.jpg?auto=webp&s=c26d698d5d92796be9c6ab47f22dba63a7be96c3"
            title="Get THE BATMAN fan merch from the gift shop!"
            description=""
          />
          <Promotion
            imageSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Popcorn_9.jpg/1600px-Popcorn_9.jpg?20210113170355"
            title="Win one whole year's supply of popcorn!"
            description="Participate with a minimum spend of S$100 in a single receipt."
          />
        </div>
      </div>

      <ul className="nav nav-pills justify-content-center my-4">
        <li className="nav-item">
          <a
            href="#"
            className={classNames('nav-link', {
              active: tab === 'now_showing',
            })}
            aria-current={tab === 'now_showing' ? 'page' : undefined}
            onClick={() => setTab('now_showing')}
          >
            Now Showing
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={classNames('nav-link', {
              active: tab === 'coming_soon',
            })}
            aria-current={tab === 'coming_soon' ? 'page' : undefined}
            onClick={() => setTab('coming_soon')}
          >
            Coming Soon
          </a>
        </li>
      </ul>
      <div className="container d-flex flex-column">
        <MovieTab type={tab} />
      </div>
    </Layout>
  );
};

export default Home;

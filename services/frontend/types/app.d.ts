declare namespace SilverVillage {
  interface CurrentUser {
    id: number;
    email: string;
    username: string;
    display_name: string;
    role: 'manager' | null;
  }

  interface Rating {
    author: string;
    author_avatar_path: string;
    content: string;
  }

  interface Trailer {
    key: string;
    name: string;
    site: 'YouTube';
    type:
      | 'Featurette'
      | 'Behind the Scenes'
      | 'Bloopers'
      | 'Clip'
      | 'Teaser'
      | 'Trailer';
  }

  interface Showtime {
    start: string;
    end: string;
    movieId: number;
    id: number;
  }

  interface Seating {
    seatid: number;
    seatnumber: number;
    seatrow: string;
    showtimeid: number;
  }

  interface Booking {
    bookingid: number;
    contact: string;
    showtimeid: number;
    userid: number;
    transactionid: string | null;
  }

  /**
   * TBD
   */
  interface Movie {
    movie_id: number;
    title: string;
    director: string;
    cast: string;
    synopsis: string;
    genre: string;
    duration_min: number;
    poster: string;
    release_date: date;
    rating: string;
    language: string;
    score: float;
    ratings: Rating[];
    trailers: Trailer[];
    showtimes: Showtime[];
  }
}

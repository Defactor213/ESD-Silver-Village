import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

const NewBooking: React.FC = function () {
  const { data, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (data == null) {
      router.push('/login');
    }
  }, [data, loading, router]);

  const { movieID } = router.query;

  if (data == null) {
    return null;
  }

  return (
    <Layout>
      <Navbar />

      <div className="container">Booking for movie ID {movieID}</div>
    </Layout>
  );
};

export default NewBooking;

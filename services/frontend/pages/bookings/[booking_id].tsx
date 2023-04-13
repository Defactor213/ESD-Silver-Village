import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Layout from '../../components/Layout';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import useAuth from '../../hooks/useAuth';

const SingleBookingPage: React.FC = function () {
  const router = useRouter();
  const { data: authData, loading: authLoading } = useAuth();

  const { booking_id } = router.query;

  const [booking, setBooking] = useState<SilverVillage.Booking | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authData == null) {
      router.push('/login');
    }
  }, [router, authData, authLoading]);

  useEffect(() => {
    if (booking_id == null) {
      return;
    }

    async function fetchBooking() {
      const resp = await fetch(
        `${process.env.API_ROOT}/bookings/${booking_id}`
      );

      if (!resp.ok) {
        router.push('/404');
        return;
      }

      const data = await resp.json();

      setBooking(data.data.booking);
    }

    fetchBooking();
  }, [booking_id, router]);

  return (
    <Layout>
      <Navbar />

      {authLoading || booking == null ? (
        <Spinner />
      ) : (
        <div className="container">
          <h1>Booking Confirmed</h1>

          <h1>Status: {booking.transactionid != null ? 'Paid' : 'Unpaid'}</h1>
        </div>
      )}
    </Layout>
  );
};

export default SingleBookingPage;

import React from 'react';

import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

const Cinemas: React.FC = function () {
  return (
    <Layout>
      <Navbar />

      <div className="container">
        <h1>Our Locations</h1>
      </div>
    </Layout>
  );
};

export default Cinemas;

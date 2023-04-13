import React from 'react';

import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

const NotFound: React.FC = function () {
  return (
    <Layout>
      <Navbar />

      <div className="container">
        <h1>Uh oh!</h1>

        <span>Not Found</span>
      </div>
    </Layout>
  );
};

export default NotFound;

import React from "react";

import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

const Experiences: React.FC = function () {
    return (
        <Layout>
            <Navbar />
            <div className="container">
                <h1>Experiences</h1>
            </div>
        </Layout>
    );
};

export default Experiences;
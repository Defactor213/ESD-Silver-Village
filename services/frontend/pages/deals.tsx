import React from "react";
import { SmallCard } from "../components/smallcard";
import { Row } from "../components/Row";

import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

const Deals: React.FC = () => {
    return (
        <Layout>
            <Navbar />
            <div className="container">
                <h1>Our current deals</h1>
                <Row>
                    <SmallCard>
                        <img src="https://www.gv.com.sg/media/imagesresize/promo_sonic2giveaway.jpg" width="248" height="428"></img>
                        <h3>Be fast like Sonic and grab your sticker sheet when you purchase SuperSonic sneaks tickets on 30 March!</h3>
                    </SmallCard>
                    <SmallCard>
                        <img src="https://media.gv.com.sg/imagesresize/combo_thebadguys.jpg" width="248" height="428"></img>
                        <h3>Get this Exclusive The Bad Guys Combo at only $12! Available at all SV Cinemas!</h3>
                    </SmallCard>
                </Row>
            </div>
        </Layout>
    );
};

export default Deals;
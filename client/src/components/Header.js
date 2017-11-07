// components/Header.js

import React from 'react';
import { Jumbotron } from 'react-bootstrap';

const Header = () => (
    <div>
        <Jumbotron style = {{ textAlign: 'center' }}>
            <h1>FreeCodeCamp StockCharter App</h1>
            <p>(built using the Alpha Vantage API)</p>
        </Jumbotron>
    </div>
);

export default Header;

// components/Header.js

import React from 'react';
import { Jumbotron } from 'react-bootstrap';

const Header = () => (
    <div>
        <Jumbotron style = {{ textAlign: 'center' }}>
            <h1>FreeCodeCamp StockCharter App</h1>
        </Jumbotron>
    </div>
);

export default Header;

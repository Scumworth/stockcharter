// components/Main.js

import React from 'react';
import StockGraph from './StockGraph';
import StockBox from './StockBox';
import StockForm from './StockForm';

const Main = ({ results }) => (
    <div>
        <StockGraph />
        {
            results.length !== 0
                ? results.map(result => <StockBox
                />)
                : null
        }
        <StockForm />
    </div>
);

export default Main;

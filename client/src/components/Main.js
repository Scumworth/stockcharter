// components/Main.js

import React from 'react';
import StockGraph from './StockGraph';
import StockBox from './StockBox';
import StockForm from './StockForm';

const Main = ({ results, period, handleChange, handleSubmit, handleRemove, selectedStock }) => (
    <div>
        <StockGraph 
            results = { results }
            period = { period }
        />
        {
            results.length !== 0
                ? results.map(result => <StockBox
                    name = { result.name }
                    handleRemove = { handleRemove }
                />)
                : null
        }
        <StockForm 
            handleChange = { handleChange }
            handleSubmit = { handleSubmit }
            selectedStock = { selectedStock }
        />
    </div>
);

export default Main;

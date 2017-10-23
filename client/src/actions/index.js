// actions/index.js

import axios from 'axios';

export const REQUEST_STOCKS = 'REQUEST_STOCKS';
export const RECEIVE_STOCKS = 'RECEIVE_STOCKS';

export const requestStocks = () => ({
    type: REQUEST_STOCKS
});

export const receiveStocks = (data) => ({
    type: RECEIVE_STOCKS,
    results: data.map(stock => ({...stock}))
})

export const getStocks = (url) => dispatch => {
    dispatch(requestStocks);
    axios.get(`${url}/stocks`)
        .then(res => {
            return res.data;
        }, e => console.log(e))
        .then(data => {
            dispatch(receiveStocks(data));
        });
}

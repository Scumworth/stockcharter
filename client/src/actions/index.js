// actions/index.js

import axios from 'axios';

export const STARTING_STOCKS = 'STARTING_STOCKS';

export const startingStocks = (data) => ({
    type: STARTING_STOCKS,
    results: data
})

//Sockets
export const loadStartingStocks = (socket) => dispatch => {
    socket.on('startingStockList', res => {
        dispatch(startingStocks(res));
    });
}


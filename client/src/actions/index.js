// actions/index.js

export const STARTING_STOCKS = 'STARTING_STOCKS';
export const UPDATE_STOCKS = 'UPDATE_STOCKS';
export const EDIT_SELECTED_STOCK = 'EDIT_SELECTED_STOCK';
export const LOADING = 'LOADING';

export const startingStocks = (data) => ({
    type: STARTING_STOCKS,
    results: data
});

export const updateStocks = (data) => ({
    type: UPDATE_STOCKS,
    results: data
})

export const editSelectedStock = (value) => ({
    type: EDIT_SELECTED_STOCK,
    value
});

export const loading = () => ({
    type: LOADING
})

//Sockets
export const loadStartingStocks = (socket) => dispatch => {
    socket.on('startingStockList', res => {
        dispatch(startingStocks(res.stockData));
    });
}



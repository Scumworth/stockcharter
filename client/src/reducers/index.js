// reducers/index.js

import { combineReducers } from 'redux';
import { STARTING_STOCKS, UPDATE_STOCKS, EDIT_SELECTED_STOCK } from '../actions';

const selectedStock = (state = null, action) => {
    switch(action.type) {
        case EDIT_SELECTED_STOCK:
            return action.value;
        default:
            return state;
    }
}

const stocks = (state = {
    isFetching: false,
    stocksLoaded: false,
    period: 365,
    results: []
}, action) => {
    switch (action.type) {

        case STARTING_STOCKS:
            return {
                ...state,
                stocksLoaded: true,
                results: action.results
            }
        case UPDATE_STOCKS:
            return {
                ...state,
                results: action.results
            }
        default:
            return state;
    }
}

const stockCharterApp = combineReducers({
    stocks,
    selectedStock
});

export default stockCharterApp;

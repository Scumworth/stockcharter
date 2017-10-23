// reducers/index.js

import { combineReducers } from 'redux';
import { REQUEST_STOCKS, RECEIVE_STOCKS } from '../actions';

const stocks = (state = {
    isFetching: false,
    stocksLoaded: false,
    results: []
}, action) => {
    switch (action.type) {
        case REQUEST_STOCKS:
            return {
                ...state,
                isFetching: true
            }
        case RECEIVE_STOCKS:
            return {
                ...state,
                isFetching: false,
                stocksLoaded: true,
                results: action.results
            }
        default:
            return state;
    }
}

const stockCharterApp = combineReducers({
    stocks
});

export default stockCharterApp;

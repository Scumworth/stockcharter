// reducers/index.js

import { combineReducers } from 'redux';
import { STARTING_STOCKS } from '../actions';

const stocks = (state = {
    isFetching: false,
    stocksLoaded: false,
    results: []
}, action) => {
    switch (action.type) {

        case STARTING_STOCKS:
            return {
                ...state,
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

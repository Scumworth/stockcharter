// store.js

import { createStore, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import reducer from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const history = createHistory();
const middleware = [thunk, logger];
const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);

export default store;

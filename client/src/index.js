// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './containers/App';
import store from './store';
//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store = { store }> 
        <div>
            <App 
                url = 'http://localhost:3000/api'
            />
        </div>
    </Provider>, 
    document.getElementById('root')
);

//registerServiceWorker();

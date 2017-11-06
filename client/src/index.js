// index.js

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/css/bootstrap-theme.css';
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
            <App />
        </div>
    </Provider>, 
    document.getElementById('root')
);

//registerServiceWorker();

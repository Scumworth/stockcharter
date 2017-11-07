// containers/App.js

import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import PeriodBar from './../components/PeriodBar';
import Main from './../components/Main';
import { connect } from 'react-redux';
import { loadStartingStocks, changePeriod, updateStocks, editSelectedStock, loading } from './../actions';
import Loader from 'react-loader';
import io from 'socket.io-client';
let socket;

const devHost = 'https://localhost:3001';
const prodHost = 'https://evening-beach-99280.herokuapp.com';

class App extends Component {

    constructor(props) {
        super(props);
        const dispatch = this.props.dispatch;
        socket = io.connect(prodHost);
        socket.on('updateStockList', res => {
               dispatch(updateStocks(res.stockData)) 
        });
    }
    componentDidMount() {
        this.props.loadStartingStocks(socket); 
    }
    componentWillUnmount() {
        socket.disconnect();
    }
    render() {
        return (
            <div> 
                <Loader loaded = { this.props.stocksLoaded }>
                    <Header />
                    <PeriodBar 
                        handleChangePeriod = { this.props.handleChangePeriod }
                    />
                    <Main 
                        results = { this.props.results }
                        handleChange = { this.props.handleChange }
                        handleSubmit = { this.props.handleSubmit }
                        handleRemove = { this.props.handleRemove }
                        selectedStock = { this.props.selectedStock }
                        period = { this.props.period }
                        stocksLoaded = { this.props.stocksLoaded }
                    />
                    <Footer />
                </Loader>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { stocks, selectedStock } = state;
    const { results, stocksLoaded, period } = stocks;
    return { results, stocksLoaded, selectedStock, period };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleChange: (e) => {
            e.preventDefault();
            const target = e.target;
            const value = target.value;
            dispatch(editSelectedStock(value));
        },
        handleSubmit: (e, selectedStock) => {
            e.preventDefault();
            console.log('handleSubmit');
            socket.emit('addStock', selectedStock);
        },
        handleChangePeriod: (e, newPeriod) => {
            e.preventDefault();
            console.log('changePeriod');
            dispatch(changePeriod(newPeriod));
        },
        handleRemove: (e, removedStock) => {
            e.preventDefault();
            console.log('handleRemove');
            dispatch(loading());
            socket.emit('removeStock', removedStock);
        },
        loadStartingStocks: (socket) => {
            dispatch(loadStartingStocks(socket));
        },
        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

// containers/App.js

import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import Main from './../components/Main';
import { connect } from 'react-redux';
import { loadStartingStocks, updateStocks, editSelectedStock } from './../actions';
import Loader from 'react-loader';
import io from 'socket.io-client';
let socket;

class App extends Component {

    constructor(props) {
        super(props);
        const dispatch = this.props.dispatch;
        socket = io.connect('http://localhost:3001');
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
                    <Main 
                        results = { this.props.results }
                        handleChange = { this.props.handleChange }
                        handleSubmit = { this.props.handleSubmit }
                        handleRemove = { this.props.handleRemove }
                        selectedStock = { this.props.selectedStock }
                        period = { this.props.period }
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
        handleRemove: (e, removedStock) => {
            e.preventDefault();
            console.log('handleRemove');
            socket.emit('removeStock', removedStock);
        },
        loadStartingStocks: (socket) => {
            dispatch(loadStartingStocks(socket));
        },
        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

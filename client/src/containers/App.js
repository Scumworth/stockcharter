import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import Main from './../components/Main';
import { connect } from 'react-redux';
import { getStocks } from './../actions';
import Loader from 'react-loader';
//const Loader = require('react-loader');

class App extends Component {
    componentDidMount() {
        this.props.getStocks(this.props.url); 
    }
    render() {
        return (
            <div> 
                <Loader loaded = { this.props.stocksLoaded }>
                    <Header />
                    <Main 
                        results = { this.props.results }
                    />
                    <Footer />
                </Loader>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { stocks } = state;
    const { results } = stocks;
    return { results };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStocks: (url) => {
            dispatch(getStocks(url));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import Main from './../components/Main';
import { connect } from 'react-redux';
import { loadStartingStocks } from './../actions';
import Loader from 'react-loader';
import io from 'socket.io-client';
let socket;

class App extends Component {

    constructor(props) {
        super(props);
        socket = io.connect('http://localhost:3001');
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
                    />
                    <Footer />
                </Loader>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { stocks } = state;
    const { results, stocksLoaded } = stocks;
    return { results, stocksLoaded };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadStartingStocks: (socket) => {
            dispatch(loadStartingStocks(socket));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

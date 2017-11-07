// server/index.js
'use strict'
    
require('dotenv').config();
const express = require('express');
const { mongoose } = require('./db/mongoose');
const { Stock } = require('./models/stock');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios');
const moment = require('moment');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3001;
const apiUrl = 'https://www.alphavantage.co/query?';

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

http.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});

const parseStockData = (results) => {

    const allStockData = [];

    results.forEach(stock => {
        const record = stock.history['Time Series (Daily)'];
        const openingArray = [];
        const data = {};
        const oneYearArray = [];
        for (const date in record) {
            openingArray.push({date: date, open: record[date]['1. open']});
        }
        const reversedArray = openingArray.reverse();
        for (let i = reversedArray.length - 365; i < reversedArray.length; i++) {
            oneYearArray.push(reversedArray[i]);
        }
        data.oneYear = oneYearArray;
        allStockData.push({name: stock.name, data: data});
    });

    return allStockData;
}

//socket logic

const updateStocks = (socket) => {

    Stock.find({}).then((data) => {
        
        if(data.length === 0) {
            io.sockets.emit('updateStockList', { stockData: [] });
        }
        else {
            const stockArray = data.map(stock => { return {name: stock.name, data: stock.data} });
            const stockNames = data.map(stock => stock.name);

            //CHECK TO SEE MOST RECENT DATES IN DB
            const today = moment(new Date()).format('YYYY-MM-DD')
            let dateCount = 0;
            for (let i = 0; i < stockArray.length; i++) {
                const mostRecentDate = stockArray[i].data.oneYear[stockArray[i].data.oneYear.length - 1].date;
                if (mostRecentDate  === today) {
                    dateCount++
                }
            }
            
            if (dateCount === stockArray.length) {
                io.sockets.emit('updateStockList', { stockData: stockArray });
            }
            
            // OTHERWISE GET DATA FROM AXIOS CALL
            else {
                const stockArrayAxios = []
                const requests = []; 
                for (let i = 0; i < stockNames.length; i++) {
                    requests.push(axios.get(`${apiUrl}function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockNames[i]}&outputsize=full&apikey=${process.env.API_KEY}`) );
                }
                axios.all(requests)
                    .then(res => {
                        for (let i = 0; i < stockNames.length; i++) {
                            stockArrayAxios.push({ name: stockNames[i], history: res[i].data })
                        }
                        return stockArrayAxios;
                    })
                    .then(stockArrayAxios => io.sockets.emit('updateStockList', { stockData: parseStockData(stockArrayAxios)}))
                    .catch(e => console.log('axios failed to process all api requests while getting initial stocks'));
            }
        }
    }).catch(e => console.log('Failed to access database.'));
};

const getInitialStocks = (socket) => {

    Stock.find({}).then((data) => {
        
        if(data.length === 0) {
            socket.emit('startingStockList', { stockData: [] });
        }
        else {
            const stockArray = data.map(stock => { return {name: stock.name, data: stock.data} });
            const stockNames = data.map(stock => stock.name);

            //CHECK TO SEE MOST RECENT DATES IN DB
            const today = moment(new Date()).format('YYYY-MM-DD')
            let dateCount = 0;
            for (let i = 0; i < stockArray.length; i++) {
                const mostRecentDate = stockArray[i].data.oneYear[stockArray[i].data.oneYear.length - 1].date;
                if (mostRecentDate  === today) {
                    dateCount++
                }
            }
            
            if (dateCount === stockArray.length) {
                socket.emit('startingStockList', { stockData: stockArray });
            }
            
            // OTHERWISE GET DATA FROM AXIOS CALL
            else {
                const stockArrayAxios = []
                const requests = []; 
                for (let i = 0; i < stockNames.length; i++) {
                    requests.push(axios.get(`${apiUrl}function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockNames[i]}&outputsize=full&apikey=${process.env.API_KEY}`) );
                }
                axios.all(requests)
                    .then(res => {
                        for (let i = 0; i < stockNames.length; i++) {
                            stockArrayAxios.push({ name: stockNames[i], history: res[i].data })
                        }
                        return stockArrayAxios;
                    })
                    .then(stockArrayAxios => socket.emit('startingStockList', { stockData: parseStockData(stockArrayAxios)}))
                    .catch(e => console.log('axios failed to process all api requests while getting initial stocks'));
            }
        }
    }).catch(e => console.log('Failed to access database.'));
};

io.on('connection', socket => {
    console.log(`Connected to socket ${socket.id}`);
    // load initial stocks
    getInitialStocks(socket);

    // add stock
    socket.on('addStock', (selectedStock) => {
        axios.get(`${apiUrl}function=TIME_SERIES_DAILY_ADJUSTED&symbol=${selectedStock}&outputsize=full&apikey=${process.env.API_KEY}`)
            .then(res => {
            const apiError = res.data['Error Message'];
            if(apiError !== undefined){
                console.log('Not a valid stock symbol');
                //TEST below
                updateStocks(socket);
            }
            else {
                console.log('Stock found');  
                const record = res.data['Time Series (Daily)'];
                const openingArray = [];
                const data = {};
                const oneYearArray = [];
                for (const date in record) {
                    openingArray.push({date: date, open: record[date]['1. open']});
                }
                const reversedArray = openingArray.reverse();
                for (let i = reversedArray.length - 365; i < reversedArray.length; i++) {
                    oneYearArray.push(reversedArray[i]);
                }
                data.oneYear = oneYearArray;
                const newStock = new Stock({
                    name: selectedStock,
                    data: data
                });
                newStock.save()
                    .then(() => {
                        console.log('Stock saved');
                        updateStocks(socket);
                    })
                    .catch(e => console.log(e));
            }
                    })
        .catch(e => console.log('API call failed'));
    });

    // remove stock
    socket.on('removeStock', (selectedStock) => {
        Stock.remove({ name: selectedStock })
            .then(() => {
                updateStocks(socket);
            })
    });

    // disconnect socket
    socket.on('disconnect', () => console.log(`Disconnected ${socket.id}`));

});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});



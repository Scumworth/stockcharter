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
        if (data.length === 0) {
            socket.emit('updateStockList', { stockData: [] });
        }
        else {
            const stockNames = data.map((stock) => stock.name);
            const stockData = [];
            //for (let i = 0; i < stockNames.length; i++) {
                //axios.get(`${apiUrl}function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockNames[i]}&outputsize=full&apikey=${process.env.API_KEY}`)
                    //.then(res => {
                        //stockData.push({ name: stockNames[i], history: res.data })
                        //if (i === stockNames.length - 1) {
                            //socket.emit('updateStockList', { stockData: parseStockData(stockData) });
                        //}
                    //})
                    //.catch(e => console.log(`Could not access history for ${stockNames[i]}`));
            //}
            const requests = []; 
            for (let i = 0; i < stockNames.length; i++) {
                requests.push(axios.get(`${apiUrl}function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockNames[i]}&outputsize=full&apikey=${process.env.API_KEY}`) );
            }
            axios.all(requests)
                .then(res => {
                    for (let i = 0; i < stockNames.length; i++) {
                        stockData.push({ name: stockNames[i], history: res[i].data })
                    }
                    socket.emit('updateStockList', { stockData: parseStockData(stockData) });
                }).catch(e => console.log(e));
        }
    }).catch(e => console.log('Failed to access database.'));
};

const getInitialStocks = (socket) => {
    Stock.find({}).then((data) => {
        if(data.length === 0) {
            socket.emit('startingStockList', { stockData: [] });
        }
        else {
            const stockNames = data.map(stock => stock.name);
            const stockData = [];

            //for (let i = 0; i < stockNames.length; i++) {
                //axios.get(`${apiUrl}function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockNames[i]}&outputsize=full&apikey=${process.env.API_KEY}`)
                    //.then(res => {
                        //stockData.push({name: stockNames[i], history: res.data})
                        //if (i === stockNames.length - 1) {
                            //console.log(stockData);
                            //socket.emit('startingStockList', { stockData: parseStockData(stockData) });
                        //}
                    //})
                    //.catch(e => console.log(`Could not access history for ${stockNames[i]}`));
           //}
            const requests = []; 
            for (let i = 0; i < stockNames.length; i++) {
                requests.push(axios.get(`${apiUrl}function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockNames[i]}&outputsize=full&apikey=${process.env.API_KEY}`) );
            }
            axios.all(requests)
                .then(res => {
                    for (let i = 0; i < stockNames.length; i++) {
                        stockData.push({ name: stockNames[i], history: res[i].data })
                    }
                    socket.emit('startingStockList', { stockData: parseStockData(stockData) });
                }).catch(e => console.log(e));
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
            console.log('error message', res.data['Error Message']);
            const apiError = res.data['Error Message'];
            if(apiError !== undefined){
                console.log('Not a valid stock symbol');
            }
            else {
                console.log('Stock found');
                const newStock = new Stock({
                    name: selectedStock
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



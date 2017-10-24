// server/index.js
'use strict'

const googleStocks = require('google-stocks');
const express = require('express');
const { mongoose } = require('./db/mongoose');
const { Stock } = require('./models/stock');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3001;

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(cors());
app.use(bodyParser.json());

http.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});

//socket logic
io.on('connection', socket => {
    console.log(`Connected to socket ${socket.id}`);
    Stock.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            socket.emit('startingStockList', result)
            console.log('startingStockList retrieved');
        }
    });
    socket.on('disconnect', () => console.log(`Disconnected ${socket.id}`));

});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});



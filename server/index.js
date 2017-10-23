// server/index.js
'use strict'

import googleStocks from 'google-stocks';
import express from 'express';
import mongoose from './db/mongoose';
import Stock from './models/stock';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(cors());
app.use(bodyParser.json());

router.get('/', (req, res) => {
    res.json({ message: 'API initialized' });
});

router.route('/stocks')
    .get((req, res) => {
        console.log(req.body.stock);
    })
    .post((req, res) => {
        
    });

app.use('/api', router);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

http.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});


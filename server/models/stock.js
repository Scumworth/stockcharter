// server/models/stock.js
'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    name: { type: String, required: true }
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = { Bar }

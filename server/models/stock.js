// server/models/stock.js 'use strict'; 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    name: { type: String, required: true, unique: true, uppercase: true },
    data: Schema.Types.Mixed
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = { Stock }

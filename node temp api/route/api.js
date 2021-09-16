const express = require('express');

const app = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/insert', require('./insert/insert'))


module.exports = app
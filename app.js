const express = require('express');
const app = express();
const {getAllCategories} = require('./controllers/games.controller');
const {catch404Error,catch500Error} = require('./controllers/errors.controller')

app.get('/api/categories', getAllCategories);

app.all('*',catch404Error);

app.use(catch500Error);

module.exports = app;
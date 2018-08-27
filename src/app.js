const express = require('express');
const app = express();

app.use('/', (req, res, next) => {
	res.send('Welcome to Bloccit');
});

const routeConfig = require('./config/route-config.js');

routeConfig.init(app);

module.exports = app;

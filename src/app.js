const express = require('express');
const app = express();
const appConfig = require('./config/main-config.js');

app.use('/', (req, res, next) => {
	res.send('Welcome to Bloccit');
});

const routeConfig = require('./config/route-config.js');

routeConfig.init(app);
appConfig.init()

module.exports = app;
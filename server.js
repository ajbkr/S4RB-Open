'use strict';

const express = require('express'),
	path = require('path');

const app = express();

app.get('/data/cpmu', (req, res) => {
	res.sendFile(path.join(__dirname, 'data/cpmu.csv'));
});

app.listen(3000, () => console.log('App is listening'));

module.exports = app;

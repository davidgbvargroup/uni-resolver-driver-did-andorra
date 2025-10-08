'use strict';

var http = require('http');
const express = require('express');
const controllers = require('./controllers/Default');

const serverPort = 8080;

const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

app.get('/1.0/identifiers/:identifier', controllers.resolve);

http.createServer(app).listen(serverPort, function () {
console.log('Server is running on port %d', serverPort);
});
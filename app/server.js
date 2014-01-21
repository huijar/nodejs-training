var express = require('express');
var app = express();

var _ = require('underscore');

var get = require('./get.js');
var weather = require('./weather.js');

app.get('/get/:url', function(req, res) {
    get(req.params.url, function(err, getRes) {
        if (err) {
            res.send(500);
        } else {
            res
                .status(getRes.status)
                .set('Content-Type', getRes.headers['content-type'])
                .send(getRes.text);
        }
    });
});

app.get('/forecast', function(req, res) {
    if (!req.query.city) {
        res.json(400, { status: 400, message: "'city' query parameter required" });
        return;
    }

    weather.forecast(req.query.city, function(err, weather) {
        if (err) {
            console.log(err);
            res.json(500, { status: 500 });
        } else {
            res.json(200, weather);
        }
    });
});

module.exports = app;
var express = require('express');
var app = express();

var querystring = require('querystring');
var _ = require('underscore');

var get = require('./get.js');

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

    get('http://api.openweathermap.org/data/2.5/forecast/daily?' + querystring.stringify({
        mode: 'json',
        q: req.query.city,
        units: 'metric',
        cnt: 3
    }), function(err, getRes) {
        if (err || getRes.error) {
            console.log(err || getRes.error);
            res.json(500, { status: 500 });
        } else {
            res.json(200, {
                city: req.query.city,
                forecast: _.map(getRes.body.list, function(day) {
                    return {
                        weather: day.weather.description,
                        temp: day.temp.day,
                        wind: {
                            speed: day.speed,
                            dir: day.deg
                        }
                    };
                })
            });
        }
    });
});

module.exports = app;
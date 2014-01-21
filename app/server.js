var express = require('express');
var app = express();

var _ = require('underscore');

var get = require('./get.js');
var weather = require('./weather.js');

// For req.flash
app.use(express.cookieParser('mylab secrets'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(require('connect-flash')());

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

app.post('/summary/generate', express.json(), function(req, res) {
    if (!req.body.cities || !(req.body.cities instanceof Array)) {
        res.json(400, { status: 400, message: "'cities' array body attribute required" });
        return;
    }

    _.each(req.body.cities, function(city) {
        req.flash('cities', city);
    });

    res.redirect(303, '/summary/report');
});

app.get('/summary/report', function(req, res) {
    weather.summary(req.flash('cities'), function(err, report) {
        if (err) {
            console.log(err);
            res.json(500, { status: 500 });
        } else {
            res.json(200, report);
        }
    });
});

module.exports = app;
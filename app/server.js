var express = require('express');
var app = express();

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

module.exports = app;
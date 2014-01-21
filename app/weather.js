var querystring = require('querystring');
var _ = require('underscore');
var async = require('async');

var get = require('./get.js');

module.exports = {
    forecast: function(city, cb) {
        get('http://api.openweathermap.org/data/2.5/forecast/daily?' + querystring.stringify({
            mode: 'json',
            q: city,
            units: 'metric',
            cnt: 3
        }), function(err, getRes) {
            if (err || getRes.error) {
                cb(err || getRes.error);
            } else {
                cb(null, {
                    city: city,
                    forecast: _.map(getRes.body.list, function(day) {
                        return {
                            weather: day.weather[0].description,
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
    },

    today: function(city, cb) {
        this.forecast(city, function(err, res) {
            if (err) {
                cb(err);
            } else {
                cb(null, _.extend({
                    city: res.city
                }, res.forecast[0]));
            }
        });
    },

    summary: function(cities, cb) {
        async.map(cities, this.today.bind(this), function(err, citiesToday) {
            if (err) {
                cb(err);
                return;
            }

            report = {};

            report.numCities = citiesToday.length;

            var hottestCity = _.max(citiesToday, function(city) {
                return city.temp;
            });
            var coldestCity = _.min(citiesToday, function(city) {
                return city.temp;
            });
            var windiestCity = _.max(citiesToday, function(city) {
                return city.wind.speed;
            });

            report.hottest = _.pick(hottestCity, 'city', 'weather', 'temp');
            report.coldest = _.pick(coldestCity, 'city', 'weather', 'temp');
            report.windiest = {
                city: windiestCity.city,
                weather: windiestCity.weather,
                windSpeed: windiestCity.wind.speed
            };

            cb(null, report);
        });
    }
};
var querystring = require('querystring');
var _ = require('underscore');

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
    }
};
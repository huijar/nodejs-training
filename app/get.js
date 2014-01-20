var request = require('superagent');

module.exports = function(url, cb) {
    request
        .get(url)
        .end(function(err, res) {
            if (err) {
                // Error occurred
                cb(err);
            } else {
                // Success, pass null as error
                cb(null, res);
            }
        });
};
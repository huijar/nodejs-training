var get = require('../app/get.js');
var should = require('should');

describe('get()', function() {
    it('should be able to fetch Google front page', function(done) {
        get('http://www.google.com', function(err, res) {
            res.status.should.equal(200);
            res.text.should.not.be.empty;
            res.text.should.match(/google/);
            done(err);
        });
    });
});
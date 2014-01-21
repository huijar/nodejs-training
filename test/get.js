var get = require('../app/get.js');
var should = require('should');
var request = require('supertest');

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

describe('/get API', function() {
    it('should be able to fetch Google front page', function(done) {
        request('http://localhost:3000')
            .get('/get/' + encodeURIComponent('http://www.google.com'))
            .end(function(err, res) {
                if (err) { return done(err); }

                res.status.should.equal(200);
                res.text.should.not.be.empty;
                res.text.should.match(/google/);

                done();
            });
    });
});
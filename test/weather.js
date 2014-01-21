var should = require('should');
var request = require('supertest');

var server = 'http://localhost:3000';

describe('/forecast API', function() {
    it('should fail without a query parameter', function(done) {
        request(server)
            .get('/forecast')
            .expect(400, done);
    });

    it('should send a JSON response with a proper query parameter', function(done) {
        request(server)
            .get('/forecast?city=Tampere')
            .end(function(err, res) {
                if (err) { return done(err); }

                res.body.should.be.an.Object.with.properties("city", "forecast");
                res.body.forecast.should.be.an.Array;
                done();
            });
    });
});
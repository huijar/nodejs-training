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

describe('/summary API', function() {
    it('should fail with an empty request', function(done) {
        request(server)
            .post('/summary/generate')
            .expect(400, done);
    });

    var cookie = null;
    var resultLocation = null;

    it('should redirect and set a cookie given a few cities', function(done) {
        request(server)
            .post('/summary/generate')
            .send({
                cities: ['Helsinki,fi', 'London,uk']
            })
            .end(function(err, res) {
                if (err) { return done(err); }

                res.status.should.equal(303);
                res.headers.should.have.property('set-cookie').an.Array.not.empty;
                cookie = res.headers['set-cookie'];

                res.headers.should.have.property('location').a.String.not.empty;
                resultLocation = res.headers['location'];

                done();
            });
    });

    it('should serve the results at the redirect URI', function(done) {
        request(server)
            .get(resultLocation)
            .set('cookie', cookie)
            .end(function (err, res) {
                if (err) { return done(err); }

                res.body.should.be.an.Object.with.properties("numCities", "hottest", "coldest", "windiest");
                res.body.numCities.should.be.a.Number.and.equal(2);
                res.body.hottest.should.be.an.Object.with.properties("city", "weather", "temp");
                res.body.coldest.should.be.an.Object.with.properties("city", "weather", "temp");
                res.body.windiest.should.be.an.Object.with.properties("city", "weather", "speed");

                done();
            });
    });
});
var hello = require('../app/hello.js');
var should = require('should');

describe('Hello World', function() {
    describe('hello()', function() {
        it('should return "Hello World!"', function() {
            hello().should.equal("Hello World!");
        });
    });
});
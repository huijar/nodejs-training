var hello = require('./app/hello.js');
var get = require('./app/get.js');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        mochaTest: {
            test: {
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('test', 'mochaTest');

    grunt.registerTask('default', function() {
        console.log(hello());
    });

    grunt.registerTask('get', function() {
        var done = this.async();
        get('http://' + this.args[0], function(err, res) {
            if (err) {
                console.error(err);
                done(false);
            } else {
                console.log(res.text);
                done(true);
            }
        });
    });
};
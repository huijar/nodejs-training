var hello = require('./app/hello.js');
var get = require('./app/get.js');

var path = require('path');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        express: {
            myServer: {
                options: {
                    server: path.resolve('./app/server')
                }
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            test: {
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('test', ['express:myServer', 'mochaTest']);

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

    grunt.registerTask('server', ['express:myServer', 'express-keepalive']);
};
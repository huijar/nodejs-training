var hello = require('./app/hello.js');

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
};
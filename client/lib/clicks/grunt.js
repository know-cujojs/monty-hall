var fs = require('fs'),
	json5 = require('json5');

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-buster');

	grunt.initConfig({
		buster: {
			test: {
				config: 'test/buster.js',
				reporter: 'specification',
				color: 'none'
			}
		},
		lint: {
			files: ['*.js', 'test/**/*.js', 'transform/**/*.js', 'events/**/*.js', 'stream/**/*.js']
		},
		jshint: {
			// hack until proper .jshintrc detection is working in grunt
			options: json5.parse('' + fs.readFileSync('.jshintrc'))
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint buster');

};

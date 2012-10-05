var config = exports;

config['clicks:browser'] = {
	environment: 'browser',
	rootPath: '../',
	resources: [
		// '**' // ** is majorly broken in buster right now
		'*.js',
		'events/**/*.js',
		'stream/**/*.js',
		'transform/**/*.js'
	],
	libs: [
		'test/curl-config.js',
		'node_modules/curl/src/curl.js'
	],
	tests: [
		'test/**/*-test.js'
	]
};

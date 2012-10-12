var config;

config = exports;

config['integration:node'] = {
	environment: 'node',
	rootPath: '../',
	tests: [
		//'test/**/*-test-node.js',
		'test/**/*-test.js'
	],
	testHelpers: [
		'test/buster-assertions.js'
	]
};

config['integration:browser'] = {
	environment: 'browser',
	rootPath: '../',
	resources: [
		'**'
	],
	libs: [
		'test/curl-config.js',
		'node_modules/curl/src/curl.js'
	],
	sources: [
		// loaded as resources
	],
	tests: [
		//'test/**/*-test-browser.js',
		'test/**/*-test.js'
	],
	testHelpers: [
		'test/buster-assertions.js'
	]
};

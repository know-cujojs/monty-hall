(function (g) {

	g.curl = {
		debug: true,
		apiName: 'curl',
		baseUrl: '',
		packages: [
			{ name: 'integration', location: '', main: 'integration' },
			{ name: 'curl', location: 'node_modules/curl/src/curl', main: 'curl' },
			{ name: 'when', location: 'node_modules/when', main: 'when' }
		],
		preloads: []
	};

}(this));

(function (g) {

	g.curl = {
		debug: true,
		apiName: 'curl',
		baseUrl: '',
		packages: [
			{ name: 'clicks', location: './', main: 'clicks' },
			{ name: 'curl', location: 'node_modules/curl/src/curl', main: 'curl' }
		]
	};

}(this));

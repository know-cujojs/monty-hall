/*global curl:true*/
(function(curl) {

	var config = {
		baseUrl: '',
		pluginPath: 'curl/plugin',
		paths: {},
		packages: [
			{ name: 'clicks', location: 'lib/clicks', main: 'clicks' },
			{ name: 'cola', location: 'lib/cola', main: './cola' },
			{ name: 'curl', location: 'lib/curl/src/curl', main: '../curl' },
			{ name: 'integration', location: 'lib/integration', main: 'integration' },
			{ name: 'meld', location: 'lib/meld', main: 'meld' },
			{ name: 'poly', location: 'lib/poly', main: './poly' },
			{ name: 'rest', location: 'lib/rest', main: 'rest' },
			{ name: 'when', location: 'lib/when', main: 'when' },
			{ name: 'wire', location: 'lib/wire', main: './wire' }
		],
		preloads: ['poly/all']
	};

	curl(config, ['wire!app/main']);

})(curl);
/*global curl:true*/
(function(curl) {

	var config = {
		baseUrl: '',
		pluginPath: 'curl/plugin',
		paths: {
			curl: 'lib/curl/src/curl'
		},
		packages: [{"name":"wire","location":"lib/wire","main":"wire"},{"name":"when","location":"lib/when","main":"when"},{"name":"meld","location":"lib/meld","main":"meld"},{"name":"poly","location":"lib/poly","main":"./poly"}],
		preloads: ['poly/all']
	};

	// FIXME: wire! does not work here with curl 0.7, have to use
	// wire/wire
	curl(config, ['wire/wire!app/main']);

})(curl);
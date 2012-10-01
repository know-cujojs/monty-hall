/*global curl:true*/
(function(curl) {

	var config = {
		baseUrl: '',
		pluginPath: 'curl/plugin',
		paths: {},
		packages: [{"name":"wire","location":"lib/wire","main":"./wire"},{"name":"when","location":"lib/when","main":"when"},{"name":"meld","location":"lib/meld","main":"meld"},{"name":"poly","location":"lib/poly","main":"./poly"},{"name":"curl","location":"lib/curl/src/curl","main":"../curl"}],
		preloads: ['poly/all']
	};

	// FIXME: wire! does not work here with curl 0.7, have to use
	// wire/wire
	curl(config, ['wire/wire!app/main']);

})(curl);
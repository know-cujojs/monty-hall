(function (curl) {

	var config = {

		// this is the root of our client app
		baseUrl: '',

		// find AMD plugins here if they're un-pathed
		pluginPath: 'curl/plugin',

		packages: [
			// cujojs/curl - a small, fast AMD & CJS module loader
			{ name: 'curl', location: 'lib/curl/src/curl', main: '../curl' },

			// cujojs/wire - A light, fast, flexible Javascript IOC container
			{ name: 'wire', location: 'lib/wire', main: './wire' },

			// cujojs/when - lightweight Promises/A and when()
			{ name: 'when', location: 'lib/when', main: 'when' },

			// scothis/rest - a wonderfully RESTful HTTP client
			{ name: 'rest', location: 'lib/rest', main: 'rest' },

			// cujojs/meld - AOP for Javascript
			{ name: 'meld', location: 'lib/meld', main: 'meld' },

			// cujojs/poly - a set of tiny ES5-ish polyfills
			{ name: 'poly', location: 'lib/poly', main: './poly' },

			// cujojs/cola - an IOC-ish data-binding lib (alpha)
			{ name: 'cola', location: 'lib/cola', main: './cola' },

			// cujojs/msgs - Message oriented programming
			{ name: 'msgs', location: 'lib/msgs', main: 'msgs' },

			// s2js/clicks - client-side event capturing
			{ name: 'clicks', location: 'lib/clicks', main: 'clicks' },

			// sizzle/sizzle - a query selector (for legacy browsers)
			{ name: 'sizzle', location: 'lib/sizzle/dist', main: 'sizzle' }
		],

		// prevent auto-sniffing for locale files
		locale: false,

		// ensure we've shimmed the browser before executing any code
		preloads: ['poly/all']
	};

	// bootstrap our app by wiring the main spec
	curl(config, ['wire!app/main']).then(notify, fail);

	function notify () { console.log('loaded'); }
	function fail (ex) {
		console.log('An error occurred while loading.', ex.message);
		if (ex.stack) console.log(ex.stack);
	}

})(this.curl);

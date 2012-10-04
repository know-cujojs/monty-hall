(function(define) {
define(function(require) {

	var when;

	when = require('when');

	return function(client, options) {

		return function interceptor(request) {
			return when(client(request), function(response) {

				if(!(response.headers && response.headers.Location)) {
					return response;
				}

				var location = response.headers.Location;

				return client({ path: location });
			});
		};

	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
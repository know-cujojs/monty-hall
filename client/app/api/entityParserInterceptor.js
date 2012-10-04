(function(define) {
define(function(require) {

	var when = require('when');

	return function(client, config) {
		return function(request) {
			return when(client(request), function(response) {
				return parseResponse(config.entityParser, response);
			});
		};
	};

	function parseResponse(parser, response) {
		if(response && response.entity != null) {
			return parser.parseEntity(response.entity);
		}

		return response;
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
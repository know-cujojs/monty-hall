(function(define) {
define(function(require) {

	var createInterceptor = require('rest-template/interceptor/_base');

	return function entityParserInterceptor(client, parseEntity) {

		return createInterceptor({
			response: function(response, config) {
				if(!('entity' in response)) {
					return response;
				}

				return parseEntity(response.entity);
			}
		});
	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
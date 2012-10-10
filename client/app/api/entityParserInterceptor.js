(function(define) {
define(function(require) {

	var interceptor = require('rest/interceptor');

	return interceptor({
		response: function(response, config) {
			var parser = config.entityParser;

			if(response && response.entity != null) {
				// TODO update the response entity rather then return it. If you want only the entity down stream wrap with the entity interceptor
				// response.entity = parser.parseEntity(response.entity);
				return parser.parseEntity(response.entity);
			}

			return response;
		}
	});

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
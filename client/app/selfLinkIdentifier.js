(function(define) {
define(function(require) {

	var undef;

	return function(item) {
		var links, id;

		links = item.links;

		if(Array.isArray(links)) {
			links.some(function(link) {
				return (id = getSelfLink(link));
			});
		}

		return id;
	};

	function getSelfLink(link) {
		return link.rel === 'self' && link.href ? link.href : undef;
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
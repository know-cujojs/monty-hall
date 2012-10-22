(function(define) {
define(function(require) {

	var undef;

	/**
	 * A cujojs/cola identifier function that understands HATEOAS formatted
	 * objects that have a rel="self" link.  Given an object, searches
	 * for its rel="self" link and returns its href as the object's id.
	 * @param  {Object} item any data item
	 * @return {String|undefined} rel="self" href, if present, or undefined.
	 */
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
(function(define) {
define(function(require) {

	/**
	 * A cujojs/cola comparator function that orders items by their
	 * id, as returned by the supplied identifier function.
	 * @param  {Function} identifier Function that returns the id of a data item
	 * @return {Number}
	 *   -1 if identifier(a) < identifier(b)
	 *   0  if identifier(a) === identifier(b)
	 *   1  if identifier(a) > identifier(b)
	 */
	return function(identifier) {
		return function(a, b) {
			var aId, bId;

			aId = identifier(a);
			bId = identifier(b);

			return aId === bId ? 0
				: aId < bId ? -1
					: 1;
		};
	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
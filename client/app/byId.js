(function(define) {
define(function(require) {

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
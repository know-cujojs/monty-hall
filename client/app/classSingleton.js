/*global NodeList:true*/
(function (define) {
	define(function (require) {

		var slice, replaceClasses;

		// Borrow slice from Array
		slice = Array.prototype.slice.call.bind(Array.prototype.slice);

		// Use wire.js's replaceClasses utility
		replaceClasses = require('wire/dom/transform/replaceClasses');

		/**
		 * Given an Array (technically, a set) of CSS classes, creates a cujojs/cola
		 * data binder that ensures at most one of those classes is ever set on
		 * the node(s) which the binder is managing
		 *
		 * @param  {Array} classes set of classes
		 * @return {Function} data binding function
		 */
		return function (classes /*...*/) {
			var replacer = replaceClasses({ group: slice(arguments) });

			return function (node, data, info) {
				var propValue, setNodeClasses;

				propValue = data[info.prop];
				if (propValue == null) {
					return;
				}

				replacer(node, String(propValue).toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'));
			};
		};

	});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });
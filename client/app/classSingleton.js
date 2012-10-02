/*global NodeList:true*/
(function(define) {
define(function(require) {

	var slice, replaceClasses;

	slice = Array.prototype.slice.call.bind(Array.prototype.slice);
	replaceClasses = require('wire/dom/transform/replaceClasses');

	return function(classes /*...*/) {
		var replacer = replaceClasses({ group: slice(arguments) });

		return function(node, data, info) {
			var propValue, setNodeClasses;

			propValue = data[info.prop];
			if(propValue == null) {
				return;
			}

			replacer(node, String(propValue).toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'));
		};
	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
/*global NodeList:true*/
(function(define) {
define(function(require) {

	var slice, forEach;

	slice = Array.prototype.slice.call.bind(Array.prototype.slice);
	forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

	return function(classes /*...*/) {
		classes = slice(arguments);

		return function(node, data, info) {

			var propValue, setNodeClasses;

			propValue = data[info.prop];

			if(propValue == null) {
				return;
			}

			setNodeClasses = setClasses.bind(null, classes, String(propValue).toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'));

			if(node instanceof NodeList) {
				forEach(node, setNodeClasses);
			} else {
				setNodeClasses(node);
			}

		};
	};

	function setClasses(classesToRemove, classToAdd, node) {
		classesToRemove.forEach(function(c) {
			console.log('removing', c);
			node.classList.remove(c);
		});

		console.log('adding', classToAdd);
		node.classList.add(classToAdd);
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
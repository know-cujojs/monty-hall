/*global window:false */

define([], function () {
	"use strict";

	var trim, whitespaceRE, undef;

	whitespaceRE = /\s+/;

	trim = String.prototype.trim || (function () {
		var trimLeftRE, trimRightRE;

		trimLeftRE = /^\s+/;
		trimRightRE = /\s+$/;

		return function trim() {
			return this.toString().replace(trimLeftRE, '').replace(trimRightRE, '');
		};
	}());

	/**
	 * Tranformer for DOM nodes.  Builds the path to the node in the document
	 * including all parent nodes, IDs and class names.
	 *
	 * Example: 'HTML BODY DIV.bar.foo UL#list LI#item.the-item'
	 *
	 * @param node the node to transform
	 * @return the string representing the node location
	 */
	function nodeTransform(node) {
		var path = [], nodeStr;

		while (node) {
			if (node.nodeType === (node.ELEMENT_NODE || 1)) {
				nodeStr = node.nodeName;
				if (node.id) {
					nodeStr += '#' + node.id;
				}
				if (node.classList) {
					// classList is more friendly, but not widely supported
					if (node.classList.length > 0) {
						nodeStr += '.' + Array.prototype.slice.call(node.classList).sort().join('.');
					}
				}
				else if (node.className) {
					nodeStr += '.' + trim.apply(node.className).split(whitespaceRE).sort().join('.');
				}
				path.unshift(nodeStr);
			}
			node = node.parentNode;
		}

		return path.length === 0 ? undef : path.join(' ');
	}

	return nodeTransform;

});

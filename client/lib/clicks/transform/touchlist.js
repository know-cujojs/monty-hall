define(['./_registry'], function (transforms) {
	"use strict";

	var undef;

	function touchTransform(touch) {
		return {
			identifier: touch.identifier,
			target: transforms.lookup('node')(touch.target),
			screenX: touch.screenX,
			screenY: touch.screenY,
			clientX: touch.clientX,
			clientY: touch.clientY,
			pageX: touch.pageX,
			pageY: touch.pageY
		};
	}

	/**
	 * Transforms TouchLists and the containing Touch items
	 * @param list the TouchList
	 * @return serialization friendly array of touch events
	 */
	function touchlistTransform(list) {
		var i, safe;

		safe = [];
		for (i = 0; i < list.length; i += 1) {
			safe[i] = touchTransform(list.item(i));
		}

		return safe;
	}

	return touchlistTransform;

});

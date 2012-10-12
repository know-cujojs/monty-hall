/*global console:false */

define([], function () {
	"use strict";

	// should only ever be used for debugging
	// TODO consider wrapping another buffer to create a logging instance of that buffer

	function consoleBuffer(event) {
		console.log("clicks event: ", event);
	}

	return consoleBuffer;

});

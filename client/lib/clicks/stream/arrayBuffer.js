define([], function () {
	"use strict";

	var buffer = [];

	/**
	 * Buffer stream events in an array without a size limit
	 * @param event the event to buffer
	 */
	function arrayBuffer(event) {
		buffer.push(event);
	}

	/**
	 * Obtain a snapshot of the buffer
	 * @returns the buffer
	 */
	function get() {
		return buffer.slice();
	}

	/**
	 * Flush the buffer
	 */
	function flush() {
		buffer = [];
	}

	arrayBuffer.get = get;
	arrayBuffer.flush = flush;

	return arrayBuffer;

});

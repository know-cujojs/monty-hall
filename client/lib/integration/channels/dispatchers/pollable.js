(function (define) {
	"use strict";

	var undef;

	define([], function () {

		/**
		 * Dispatch messages to be consumed later
		 * @param {Queue} queue the queueing stategry for this
		 * dispatcher. The queue must support 'push' and 'shift' for adding and
		 * removing message from the queue respectivly. Queues may or may not
		 * be durable. The default queue is an Array.
		 */
		function pollableDispatcher(queue) {
			var dispatcher = {};

			queue = queue || [];

			/**
			 * @returns {Message} the next message, may return undefined if
			 * no messages are available
			 */
			function receive() {
				return queue.shift();
			}

			/**
			 * Enqueue a message to be consumed later
			 * @param {Message} message the message to queue
			 * @param {Function} handlerResolver handler resolver
			 * @returns {Boolean} true if enqueueing is successful
			 */
			dispatcher.dispatch = function dispatch(message, handlerResolver) {
				try {
					return !!queue.push(message);
				}
				catch (e) {
					return false;
				}
			};

			dispatcher.channelMixins = {
				receive: receive
			};
			
			return dispatcher;
		}

		return pollableDispatcher;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

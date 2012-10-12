(function (define) {
	"use strict";

	var undef;

	define(['../integration', './dispatchers/pollable'], function (integration, pollableDispatcher) {

		/**
		 * Receive the next message on a queue
		 * @param {String|Channel} target the channel to receive the message
		 * from
		 * @returns {Object} the message payload or undefined if no message is
		 * available
		 */
		integration.prototype.receive = function receive(target) {
			var message = this.resolveChannel(target).receive();
			// TODO should we return the message instead of the payload?
			return message ? message.payload : undef;
		};

		/**
		 * Create a queue channel. Messages will be queued and retrived
		 * individually.
		 * @param {String} [name] the name to register this channel under
		 * @param {Queue} [queueStrategy] the queueing strategy for this
		 * channel. The queue must support 'push' and 'shift' for adding and
		 * removing message from the queue respectivly. Queues may or may not
		 * be durable. The default queue is an Array.
		 */
		integration.prototype.queue = integration.utils.optionalName(function queue(name, queueStrategy) {
			return this._channel(name, pollableDispatcher(queueStrategy));
		});

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

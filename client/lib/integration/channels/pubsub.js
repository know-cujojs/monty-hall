(function (define) {
	"use strict";

	var undef;

	define(['../integration', './dispatchers/broadcast', './_subscribable'], function (integration, broadcastDispatcher) {

		/**
		 * Create a publish-subscribe channel. Each subscriber will receive
		 * a copy of the messages sent to this channel
		 * @param {String} [name] the name to register this channel under
		 * @returns the channel
		 */
		integration.prototype.pubsub = integration.utils.optionalName(function pubsub(name) {
			return this._channel(name, broadcastDispatcher());
		});

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

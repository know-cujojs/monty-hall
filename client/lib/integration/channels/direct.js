(function (define) {
	"use strict";

	var undef;

	define(['../integration', './dispatchers/unicast', './_subscribable'], function (integration, unicastDispatcher) {

		/**
		 * Create a direct channel. Messages will be load balanced between
		 * each subscriber. Only one will receive a copy of each message
		 * sent to this channel
		 * @param {String} [name] the name to register this channel under
		 * @param {Function} [loadBalancer] load balancer
		 * @returns the channel
		 */
		integration.prototype.direct = integration.utils.optionalName(function direct(name, loadBalancer) {
			return this._channel(name, unicastDispatcher(loadBalancer));
		});

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

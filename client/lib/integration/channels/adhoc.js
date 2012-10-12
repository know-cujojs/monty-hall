(function (define) {
	"use strict";

	var undef;

	define(['../integration', './dispatchers/dedicated'], function (integration, dedicatedDispatcher) {

		/**
		 * Create a channel that bridges directly to a handler
		 * @param {String} [name] the name to register this channel under
		 * @param {String|Handler} handler the handler for this channel
		 * @returns {Channle} the channel
		 */
		integration.prototype.adhoc = integration.utils.optionalName(function adhoc(name, handler) {
			return this._channel(name, dedicatedDispatcher(handler));
		});

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

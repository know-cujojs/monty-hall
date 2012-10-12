(function (define) {
	"use strict";

	var undef;

	define(['../integration'], function (integration) {

		/**
		 * Subscribe a handler to a channel. The channel must be
		 * subscribable
		 * @param {String|Channel} from the publishing channel
		 * @param {String|Handler} to the consuming handler
		 */
		integration.prototype.subscribe = function subscribe(from, to) {
			this.resolveChannel(from).subscribe(to);
		};

		/**
		 * Unsubscribe a hanndler from a channel. The channel must be
		 * subscribable
		 * @param {String|Channel} from the publishing channel
		 * @param {String|Handler} to the consuming handler
		 */
		integration.prototype.unsubscribe = function unsubscribe(from, to) {
			this.resolveChannel(from).unsubscribe(to);
		};

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

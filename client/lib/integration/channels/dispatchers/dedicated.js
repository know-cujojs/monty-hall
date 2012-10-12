(function (define) {
	"use strict";

	var undef;

	define([], function () {

		/**
		 * Dispatch messages to a specific handler
		 * @param {String|Handler} handler where to forward messages
		 */
		function dedicatedDispatcher(handler) {
			var dispatcher = {};

			/**
			 * Send a message to the configured handler
			 * @param {Message} message message to send
			 * @param {Function} handlerResolver handler resolver
			 * @throws exceptions from receipient channels
			 * @returns
			 */
			dispatcher.dispatch = function dispatch(message, handlerResolver) {
				handlerResolver(handler).handle(message);
				return true;
			};
			
			return dispatcher;
		}

		return dedicatedDispatcher;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

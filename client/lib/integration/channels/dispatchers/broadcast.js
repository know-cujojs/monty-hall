(function (define) {
	"use strict";

	var undef;

	define(['./_subscribable'], function (subscribableDispatcher) {

		/**
		 * Dispatch messages to all subscribed handlers
		 */
		function broadcastDispatcher() {
			var dispatcher, getHandlers;

			dispatcher = subscribableDispatcher();
			getHandlers = dispatcher._handlers;
			delete dispatcher._handlers;
			
			/**
			 * Send a message to all subscribed handlers.
			 * @param {Message} message message to send
			 * @param {Function} handlerResolver handler resolver
			 * @throws exceptions from receipient handlers
			 * @returns
			 */
			dispatcher.dispatch = function dispatch(message, handlerResolver) {
				var errors, handlers;

				errors = [];
				handlers = getHandlers();

				if (handlers.length === 0) {
					return false;
				}

				handlers.forEach(function (handler) {
					try {
						handlerResolver(handler).handle(message);
					}
					catch (e) {
						errors.push(e);
					}
				}, this);

				if (errors.length !== 0) {
					throw errors;
				}

				return true;
			};

			return dispatcher;
		}

		return broadcastDispatcher;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

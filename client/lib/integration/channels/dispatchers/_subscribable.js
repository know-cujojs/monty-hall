(function (define) {
	"use strict";

	var undef;

	define([], function () {

		/**
		 * Subscribable dispatcher
		 */
		function SubscribableDispatcher() {

			var handlers = [];

			/**
			 * Add a new handler to receive messages sent to this channel
			 * @param {Handler|String} handler the handler to recieve messages
			 */
			function subscribe(handler) {
				if (handlers.indexOf(handler) >= 0) {
					// already subscribed
					return;
				}
				handlers.push(handler);
			}

			/**
			 * Removes a handler from receiving messages sent to this channel
			 * @param {Handler|String} handler the handler to stop receiving
			 * messages
			 */
			function unsubscribe(handler) {
				var index = handlers.indexOf(handler);
				handlers = handlers.slice(0, index).concat(handlers.slice(index + 1));
			}

			/**
			 * Unsubscribe all handlers
			 */
			function destroy() {
				handlers = undef;
			}

			this.channelMixins = {
				subscribe: subscribe,
				unsubscribe: unsubscribe,
				destroy: destroy
			};

			/**
			 * Obtain a copy of the list of handlers
			 * @return {Array} the handlers
			 */
			this._handlers = function () {
				return handlers.slice();
			};

		}

		SubscribableDispatcher.prototype = {

			/**
			 * Send a messages to the desired recipients
			 * @param {Message} message the message to send
			 * @param {Function} handlerResolver handler resolver
			 */
			dispatch: function dispatch(message, handlerResolver) {
				// to be overriden
				return false;
			}

		};

		function subscribableDispatcher() {
			return new SubscribableDispatcher();
		}

		return subscribableDispatcher;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

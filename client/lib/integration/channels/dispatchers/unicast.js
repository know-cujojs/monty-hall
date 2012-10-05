(function (define) {
	"use strict";

	var undef;

	define(['./_subscribable'], function (subscribableDispatcher) {

		/**
		 * Dispatch messages to a single subscribed hanlder selected by the
		 * load balancer
		 * @param {Function} [loadBalancer=random] load balancer strategy,
		 * defaults to the random load balancer
		 */
		function unicastDispatcher(loadBalancer) {
			var dispatcher, getHandlers;

			dispatcher = subscribableDispatcher();
			getHandlers = dispatcher._handlers;
			delete dispatcher._handlers;

			// deafult to a random load balancer
			loadBalancer = loadBalancer || unicastDispatcher.loadBalancers.random();

			/**
			 * Send a message to a single handler.
			 * @param {Message} message the message
			 * @param {Function} handlerResolver handler resolver
			 * @throws exceptions from receipient handler
			 * @returns {Boolean} true if the message was received
			 */
			dispatcher.dispatch = function dispatch(message, handlerResolver) {
				var handlers, handler;

				handlers = getHandlers();
				if (handlers.length === 0) {
					return false;
				}

				handler = loadBalancer(handlers);
				handlerResolver(handler).handle(message);

				return true;
			};

			return dispatcher;
		}

		unicastDispatcher.loadBalancers = {
			random: function () {
				return function (handlers) {
					var i = Math.floor(Math.random() * handlers.length);
					return handlers[i];
				};
			},
			roundRobin: function () {
				var last;
				return function (handlers) {
					var i = (handlers.indexOf(last) + 1) % handlers.length;
					last = handlers[i];
					return last;
				};
			},
			naiveRoundRobin: function () {
				var last;
				return function (handlers) {
					var i = (last + 1) % handlers.length;
					last = i;
					return handlers[i];
				};
			}
		};

		return unicastDispatcher;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

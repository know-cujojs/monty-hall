(function (define) {
	"use strict";

	var undef;

	define(['../integration'], function (integration) {

		/**
		 * Post messages from this socket to this channel
		 * @param {WebSocket} socket the socket to receive data from
		 * @param {String|Channel} opts.output the channel to send data to
		 */
		integration.prototype.webSocketInboundAdapter = function webSocketInboundAdapter(socket, opts) {
			socket.addEventListener('message', this.inboundAdapter(opts.output, function (message) {
				return message.data;
			}));
		};

		/**
		 * Create a handler that writes message payloads to the socket
		 * @param {String} name name to register the adapter as
		 * @param {WebSocket} socket the web socket to write to
		 * @param {String|Channel} [opts.input] channel to send messages for
		 * @returns {Handler} the handler for this adapter
		 */
		integration.prototype.webSocketOutboundAdapter = integration.utils.optionalName(function webSocketOutboundAdapter(name, socket, opts) {
			var handler;

			handler = this.outboundAdapter(name, socket.send.bind(socket),
				this.noopChannel, opts.input, opts.error);

			socket.addEventListener('close', function () {
				this.unsubscribe(opts.input, handler);
			}.bind(this));

			return handler;
		});

		/**
		 * Bridges integration channels and web sockets. New connections must
		 * have their bridge restablish as the WebSocket object is not reused.
		 * Any exceptions are put on the error channel.
		 * @param {WebSocket} socket the web socket
		 * @param {String|Channel} [opts.input] channel for outbound messages
		 * @param {String|Channel} [opts.output] channel for inbound messages
		 * @param {String|Channel} [opts.error] channel for thrown exceptions
		 * or socket errors
		 */
		integration.prototype.webSocketBridge = function webSocketBridge(socket, opts) {
			if (opts.output) {
				this.webSocketInboundAdapter(socket, opts);
			}
			if (opts.input) {
				this.webSocketOutboundAdapter(socket, opts);
			}
			if (opts.error) {
				socket.addEventListener('error',  this.inboundAdapter(opts.error));
			}
		};

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

(function (require, module) {
	"use strict";

	var integration = require('../integration');
	module.exports = integration;

	/**
	 * Post messages from this connection to this channel
	 * @param {Connection} connection the connection to receive data from
	 * @param {String|Channel} opts.output the channel to send data to
	 */
	integration.prototype.nodeStreamInboundAdapter = function nodeStreamInboundAdapter(connection, opts) {
		connection.on('data', this.inboundAdapter(opts.output));
	};

	/**
	 * Create a handler that writes message payloads to the connection
	 * @param {String} name name to register the adapter as
	 * @param {Connection} connection the node stream connection to write to
	 * @param {String|Channel} [opts.input] the channel to send messages for
	 * @returns {Handler} the handler for this adapter
	 */
	integration.prototype.nodeStreamOutboundAdapter = integration.utils.optionalName(function nodeStreamOutboundAdapter(name, connection, opts) {
		var handler;

		handler = this.outboundAdapter(name, connection.write.bind(connection),
			this.noopChannel, opts.input, opts.error);

		connection.on('close', function () {
			this.unsubscribe(opts.input, handler);
		}.bind(this));

		return handler;
	});

	/**
	 * Bridges integration channels and connections from a node server. New
	 * connections this server makes are adapted to the input and output
	 * channels. Any exceptions are put on the error channel.
	 * @param {Connection} connection the node stream connection
	 * @param {String|Channel} [opts.output] channel for inbound messages
	 * @param {String|Channel} [opts.input] channel for outbound messages
	 * @param {String|Channel} [opts.error] channel for thrown exceptions
	 */
	integration.prototype.nodeStreamBridge = function nodeStreamBridge(connection, opts) {
		if (opts.output) {
			this.nodeStreamInboundAdapter(connection, opts);
		}
		if (opts.input) {
			this.nodeStreamOutboundAdapter(connection, opts);
		}
		if (opts.error) {
			connection.on('error', this.inboundAdapter(opts.error));
		}
	};

}(require, module));

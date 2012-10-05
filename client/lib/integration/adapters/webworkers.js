(function (define) {
	"use strict";

	var undef;

	define(['../integration'], function (integration) {

		/**
		 * Post messages from this work to this channel
		 * @param {MessagePort} port the worker message port to receive
		 * messages from
		 * @param {String|Channel} opts.output the channel to send messages to
		 */
		integration.prototype.webWorkerInboundAdapter = function webWorkerInboundAdapter(port, opts) {
			port.addEventListener('message', this.inboundAdapter(opts.output, function (event) {
				return event.data;
			}));
		};

		/**
		 * Create a handler that posts messages to a web worker
		 * @param {String} name name to register the adapter as
		 * @param {MessagePort} port the web worker message port to post to
		 * @param {String|Channel} [opts.input] channel to send messages for
		 * @returns {Handler} the handler for this adapter
		 */
		integration.prototype.webWorkerOutboundAdapter = integration.utils.optionalName(function webWorkerOutboundAdapter(name, port, opts) {
			return this.outboundAdapter(name, port.postMessage,
				this.noopChannel, opts.input, opts.error);
		});

		/**
		 * Bridges integration channels and web workers. Any exceptions are put
		 * on the error channel.
		 * @param {MessagePort} port the web worker message port
		 * @param {String|Channel} [opts.input] channel for outbound messages
		 * @param {String|Channel} [opts.output] channel for inbound messages
		 * @param {String|Channel} [opts.error] channel for thrown exceptions
		 * or worker errors
		 */
		integration.prototype.webWorkerBridge = function webWorkerBridge(port, opts) {
			if (opts.output) {
				this.webWorkerInboundAdapter(port, opts);
			}
			if (opts.input) {
				this.webWorkerOutboundAdapter(port, opts);
			}
			if (opts.error) {
				port.addEventListener('error', this.inboundAdapter(opts.error));
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

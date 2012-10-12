(function (require, module) {
	"use strict";

	var integration = require('../integration');
	module.exports = integration;

	/**
	 * Post messages from Redis to this channel
	 * @param {RedisClient} client the Redis client subscribe with
	 * @param {String} redisChannel the remote Redis channel to subscribe to
	 * @param {String|Channel} opts.output channel inbound redis messages are
	 * sent to
	 */
	integration.prototype.redisInboundAdapter = function redisInboundAdapter(client, redisChannel, opts) {
		client.on('message', this.inboundAdapter(opts.output, function (channel, message) {
			// make sure it's the channel we care about
			if (channel === redisChannel) {
				return message;
			}
		}));
		client.subscribe(redisChannel);
	};

	/**
	 * Create a handler that publishes messages to Redis
	 * @param {String} name name to register the adapter as
	 * @param {RedisClient} client the Redis client to publish with
	 * @param {String} redisChannel the remote Redis channel to publish to
	 * @param {String|Channel} [opts.input] channel outbound redis messages are
	 * sent from
	 * @param {String|Channel} [opts.error] channel exceptions from the redis
	 *client are sent to
	 * @returns {Handler} the handler for this adapter
	 */
	integration.prototype.redisOutboundAdapter = integration.utils.optionalName(function redisOutboundAdapter(name, client, redisChannel, opts) {
		var handler;

		handler = this.outboundAdapter(name, function (payload) {
			client.publish(redisChannel, payload);
		}, this.noopChannel, opts.input, opts.error);

		client.on('end', function () {
			this.unsubscribe(opts.input, handler);
		}.bind(this));

		if (opts.error) {
			client.on('error', this.inboundAdapter(opts.error));
		}

		return handler;
	});

	/**
	 * Bridges integration channels and Redis Pub/Sub. Any exceptions are put
	 * on the error channel.
	 * @param {Function} clientFactory function that returns a new Redis client
	 * @param {String} redisChannel the remote Redis channel to subscribe to
	 * @param {String|Channel} [opts.input] channel outbound redis messages are
	 * sent from
	 * @param {String|Channel} [opts.output] channel inbound redis messages are
	 * sent to
	 * @param {String|Channel} [opts.error] channel for thrown exceptions
	 */
	integration.prototype.redisBridge = function redisBridge(clientFactory, redisChannel, opts) {
		if (opts.output) {
			this.redisInboundAdapter(clientFactory(), redisChannel, opts);
		}
		if (opts.input) {
			this.redisOutboundAdapter(clientFactory(), redisChannel, opts);
		}
	};

}(require, module));

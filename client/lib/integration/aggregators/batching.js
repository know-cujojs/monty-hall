(function (define) {
	"use strict";

	var undef;

	define(['../integration'], function (integration) {

		/**
		 * Aggregates messages into batches as they are recieved. Batches may
		 * be chunked either by an absolute size and/or a timeout since the
		 * first message was recieved for the chunk.  Either a batch size or
		 * timeout must be specified.
		 * @param {String} [name] the name to register the aggregator as
		 * @param {Number} [opts.batch=0] absolute size of a chunk. If <=0,
		 * batch size is not a factor
		 * @param {Number} [opts.timeout=0] number of miliseconds since the
		 * first message arrived to queue the chunk. If <=0, timeout is not a
		 * factor
		 * @param {String|Channel} [opts.output] the channel to post the
		 * aggregated messages to
		 * @param {String|Channel} [opts.input] the channel to receive message
		 * from
		 * @param {String|Channel} [opts.error] channel to receive errors
		 * @returns the aggregator
		 * @throws on invaid configuration, batch size or timeout is required
		 */
		integration.prototype.batchingAggregator = integration.utils.optionalName(function batchingAggregator(name, opts) {
			var timeout, batch;

			batch = [];
			opts = opts || {};
			opts.batch = opts.batch || 0;
			opts.timeout = opts.timeout || 0;

			if (opts.batch <= 0 && opts.timeout <= 0) {
				throw new Error('Invalid configuration: batch size or timeout must be defined');
			}

			function releaseHelper(release) {
				release(batch);
				batch = [];
				clearTimeout(timeout);
				timeout = undef;
			}

			return this.aggregator(name, function (message, release) {
				batch.push(message.payload);
				if (opts.batch > 0 && batch.length >= opts.batch) {
					releaseHelper(release);
				}
				else if (!timeout && opts.timeout > 0) {
					timeout = setTimeout(function () {
						releaseHelper(release);
					}, opts.timeout);
				}
			}, opts);
		});

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

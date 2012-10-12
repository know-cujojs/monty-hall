(function (define) {
	"use strict";

	var undef;

	define(['../integration'], function (integration) {

		function sequenceNumberComparator(a, b) {
			return a.headers.sequenceNumber - b.headers.sequenceNumber;
		}

		/**
		 * Aggregates messages that were previously split by a splitter. Once
		 * all of the messages from the splitter are recieved a new message is
		 * created whose payload is an array of the split messages in order.
		 * @param {String} [name] the name to register the aggregator as
		 * @param {String|Channel} [opts.output] the channel to post the
		 * aggregated messages to
		 * @param {String|Channel} [opts.input] the channel to receive message
		 * from
		 * @param {String|Channel} [opts.error] channel to receive errors
		 * @returns the aggregator
		 */
		integration.prototype.correlatingAggregator = function correlatingAggregator(name, opts) {
			var buckets;

			// optionalName won't work since output channel may be a string
			if (arguments.length < 2) {
				opts = name;
				name = '';
			}

			buckets = {};

			return this.aggregator(name, function (message, release) {
				var correlationId, bucket;
				correlationId = message.headers.correlationId;
				if (!correlationId) {
					return;
				}
				bucket = buckets[correlationId] = buckets[correlationId] || [];
				bucket.push(message);
				if (bucket.length >= message.headers.sequenceSize) {
					bucket.sort(sequenceNumberComparator);
					release(bucket);
					delete buckets[correlationId];
				}
			}, opts);
		};

		return integration;

	});

}(
	typeof define === 'function' ? define : function (deps, factory) {
		module.exports = factory.apply(this, deps.map(require));
	}
	// Boilerplate for AMD and Node
));

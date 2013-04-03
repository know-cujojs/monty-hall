(function (define) {
	define(function (require) {

		var clicks, dom3, touch, integration;

		// Load clicks library modules (User interaction capture)
		clicks = require('clicks');
		dom3 = require('clicks/events/dom3');
		touch = require('clicks/events/touch');

		// Load the msgs library modules (Message oriented programming)
		integration = require('msgs');
		require('msgs/aggregators/batching');

		/**
		 * Creates an object that will configure the clicks library to capture user
		 * interactions (clicks, mouseovers, etc.), and send them, via the
		 * Integration library, to the server for analysis.  This could be used
		 * to analyze user behavior, for example.
		 * @return {Object} object with two methods: start() and stop(), that, as
		 * you might expect, start and stop collection of user interactions.
		 */
		return function () {
			var bus;

			return {
				start: function (client) {
					this.stop();

					bus = integration.bus();

					clicks.stream(bus.inboundAdapter('stream'));
					bus.channel('stream');
					bus.batchingAggregator('batcher', { batch: 500, timeout: 5e3, input: 'stream', output: 'chunkedStream' });
					bus.channel('chunkedStream');
					bus.subscribe('chunkedStream', bus.outboundAdapter(function (chunk) {
						client({
							method: 'post',
							entity: { data: JSON.stringify(chunk) }
						});
					}));

					clicks.attach(touch.types).attach(dom3.types);
				},
				stop: function () {
					clicks.detach();
					if (bus && bus.destroy) {
						bus.destroy();
					}
				}
			};
		};

	});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
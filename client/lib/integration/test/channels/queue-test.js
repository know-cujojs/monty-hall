(function (buster, define) {
	"use strict";

	var integration, bus, assert, refute, fail, undef;

	assert = buster.assert;
	refute = buster.refute;
	fail = buster.assertions.fail;

	buster.testCase('integration/channels/queue', {
		setUp: function (done) {
			if (integration) {
				bus = integration.bus();
				return done();
			}
			define('integration/channels/queue-test', ['integration/channels/queue'], function (i) {
				integration = i;
				bus = integration.bus();
				done();
			});
		},
		tearDown: function () {
			bus.destroy();
		},

		'should queue message and return them in order': function () {
			var line = bus.queue();

			bus.send(line, 'scott');
			bus.send(line, 'mark');
			assert.same('scott', bus.receive(line));
			assert.same('mark', bus.receive(line));
			assert.same(undef, bus.receive(line));

			bus.send(line, 'jeremy');
			assert.same('jeremy', bus.receive(line));
			assert.same(undef, bus.receive(line));
		}
	});

}(
	this.buster || require('buster'),
	typeof define === 'function' ? define : function (id, deps, factory) {
		factory(require('../../channels/queue'));
	}
	// Boilerplate for AMD and Node
));

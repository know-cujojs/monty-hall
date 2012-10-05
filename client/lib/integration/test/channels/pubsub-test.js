(function (buster, define) {
	"use strict";

	var integration, bus, assert, refute, fail, undef;

	assert = buster.assert;
	refute = buster.refute;
	fail = buster.assertions.fail;

	buster.testCase('integration/channels/pubsub', {
		setUp: function (done) {
			if (integration) {
				bus = integration.bus();
				return done();
			}
			define('integration/channels/pubsub-test', ['integration/channels/pubsub'], function (i) {
				integration = i;
				bus = integration.bus();
				done();
			});
		},
		tearDown: function () {
			bus.destroy();
		},

		'should broadcast all messages to all subscribes for pub-sub channels': function () {
			var channel, aSpy, bSpy;

			channel = bus.pubsub();
			aSpy = this.spy(function (message) {
				assert.equals('everybody gets a message!', message);
			});
			bSpy = this.spy(function (message) {
				assert.equals('everybody gets a message!', message);
			});
			channel.subscribe(bus.outboundAdapter(aSpy));
			channel.subscribe(bus.outboundAdapter(bSpy));

			bus.send(channel, 'everybody gets a message!');
			bus.send(channel, 'everybody gets a message!');

			assert.same(2, aSpy.callCount);
			assert.same(2, bSpy.callCount);
		}
	});

}(
	this.buster || require('buster'),
	typeof define === 'function' ? define : function (id, deps, factory) {
		factory(require('../../channels/pubsub'));
	}
	// Boilerplate for AMD and Node
));

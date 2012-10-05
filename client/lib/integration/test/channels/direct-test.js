(function (buster, define) {
	"use strict";

	var integration, bus, assert, refute, fail, undef;

	assert = buster.assert;
	refute = buster.refute;
	fail = buster.assertions.fail;

	buster.testCase('integration/channels/direct', {
		setUp: function (done) {
			if (integration) {
				bus = integration.bus();
				return done();
			}
			define('integration/channels/direct-test', ['integration/channels/direct'], function (i) {
				integration = i;
				bus = integration.bus();
				done();
			});
		},
		tearDown: function () {
			bus.destroy();
		},

		
		'should unicast all messages to a single subscribes for pub-sub channels': function () {
			var channel, aSpy, bSpy;

			channel = bus.direct();
			aSpy = this.spy(function (message) {
				assert.equals('one of us gets a message!', message);
			});
			bSpy = this.spy(function (message) {
				assert.equals('one of us gets a message!', message);
			});
			channel.subscribe(bus.outboundAdapter(aSpy));
			channel.subscribe(bus.outboundAdapter(bSpy));

			bus.send(channel, 'one of us gets a message!');
			bus.send(channel, 'one of us gets a message!');

			assert.same(2, aSpy.callCount + bSpy.callCount);
		}
	});

}(
	this.buster || require('buster'),
	typeof define === 'function' ? define : function (id, deps, factory) {
		factory(require('../../channels/direct'));
	}
	// Boilerplate for AMD and Node
));

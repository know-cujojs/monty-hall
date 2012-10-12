(function (buster, define) {
	"use strict";

	var integration, bus, assert, refute, fail, undef;

	assert = buster.assert;
	refute = buster.refute;
	fail = buster.assertions.fail;

	buster.testCase('integration/channels/adhoc', {
		setUp: function (done) {
			if (integration) {
				bus = integration.bus();
				return done();
			}
			define('integration/channels/adhoc-test', ['integration/channels/adhoc'], function (i) {
				integration = i;
				bus = integration.bus();
				done();
			});
		},
		tearDown: function () {
			bus.destroy();
		},

		'should send messages to a dedicated handler': function () {
			var spy = this.spy();

			bus.adhoc('in', bus.outboundAdapter(spy));

			bus.send('in', 'hello');
			assert.same(1, spy.callCount);
			assert.same('hello', spy.getCall(0).args[0]);
		}
	});

}(
	this.buster || require('buster'),
	typeof define === 'function' ? define : function (id, deps, factory) {
		factory(require('../../channels/adhoc'));
	}
	// Boilerplate for AMD and Node
));

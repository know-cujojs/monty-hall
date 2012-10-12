(function (buster, define) {
	"use strict";

	var integration, bus, assert, refute, fail, undef;

	assert = buster.assert;
	refute = buster.refute;
	fail = buster.assertions.fail;

	buster.testCase('integration/aggregators/batching', {
		setUp: function (done) {
			if (integration) {
				bus = integration.bus();
				return done();
			}
			define('integration/aggregators/batching-test', ['integration', 'integration/aggregators/batching', 'integration/channels/adhoc'], function (i) {
				integration = i;
				bus = integration.bus();
				done();
			});
		},
		tearDown: function () {
			bus.destroy();
		},

		'should batch every two messages, abandoning the last message': function (done) {
			var spy = this.spy(function (message) {
				assert.equals(['msg', 'msg'], message);
			});

			bus.adhoc('in', 'agg');
			bus.batchingAggregator('agg', { batch: 2, output: 'out' });
			bus.adhoc('out', bus.outboundAdapter(spy));

			bus.send('in', 'msg');
			assert.same(0, spy.callCount);
			bus.send('in', 'msg');
			assert.same(1, spy.callCount);
			bus.send('in', 'msg');
			assert.same(1, spy.callCount);
			bus.send('in', 'msg');
			assert.same(2, spy.callCount);
			bus.send('in', 'lost in the ether');

			setTimeout(function () {
				assert.same(2, spy.callCount);

				done();
			}, 10);
		},

		'should batch every two messages or 10ms': function (done) {
			var spy = this.spy(function (message) {
				message.forEach(function (msg) {
					assert.same('msg', msg);
				});
			});

			bus.adhoc('in', 'agg');
			bus.batchingAggregator('agg', { batch: 2, timeout: 10, output: 'out' });
			bus.adhoc('out', bus.outboundAdapter(spy));

			bus.send('in', 'msg');
			assert.same(0, spy.callCount);
			bus.send('in', 'msg');
			assert.same(1, spy.callCount);
			bus.send('in', 'msg');
			assert.same(1, spy.callCount);

			setTimeout(function () {
				assert.same(1, spy.callCount);
			}, 1);

			setTimeout(function () {
				assert.same(2, spy.callCount);

				assert.same(2, spy.getCall(0).args[0].length);
				assert.same(1, spy.getCall(1).args[0].length);

				done();
			}, 10);
		},
		'should batch every 10ms regardless of buffer size': function (done) {
			var spy = this.spy(function (message) {
				message.forEach(function (msg) {
					assert.same('msg', msg);
				});
			});

			bus.adhoc('in', 'agg');
			bus.batchingAggregator('agg', { timeout: 10, output: 'out' });
			bus.adhoc('out', bus.outboundAdapter(spy));

			bus.send('in', 'msg');
			bus.send('in', 'msg');
			bus.send('in', 'msg');
			bus.send('in', 'msg');
			bus.send('in', 'msg');
			assert.same(0, spy.callCount);

			setTimeout(function () {
				assert.same(0, spy.callCount);
			}, 1);

			setTimeout(function () {
				assert.same(1, spy.callCount);
			}, 10);

			setTimeout(function () {
				assert.same(1, spy.callCount);

				bus.send('in', 'msg');
				bus.send('in', 'msg');
				bus.send('in', 'msg');
			}, 30);

			setTimeout(function () {
				assert.same(2, spy.callCount);

				assert.same(5, spy.getCall(0).args[0].length);
				assert.same(3, spy.getCall(1).args[0].length);

				done();
			}, 50);
		},
		'should assert a valid configuration for an aggregator': function () {
			bus.batchingAggregator({ batch: 10, timeout: 10 });
			bus.batchingAggregator('agg1', { batch: 10, timeout: 10 });
			bus.batchingAggregator('agg2', { timeout: 10 });
			bus.batchingAggregator('agg3', { batch: 10 });
			bus.batchingAggregator('agg4', { batch: 0, timeout: 10 });
			bus.batchingAggregator('agg5', { batch: 10, timeout: 0 });

			try {
				bus.batchingAggregator('agg6', {});
				fail('Exception expected');
			}
			catch (e) {
				assert(e);
			}

			try {
				bus.batchingAggregator('agg7', { timeout: 0 });
				fail('Exception expected');
			}
			catch (e) {
				assert(e);
			}

			try {
				bus.batchingAggregator('agg8', { batch: 0 });
				fail('Exception expected');
			}
			catch (e) {
				assert(e);
			}

			try {
				bus.batchingAggregator('agg9', { timeout: 0, batch: 0 });
				fail('Exception expected');
			}
			catch (e) {
				assert(e);
			}
		}
	});

}(
	this.buster || require('buster'),
	typeof define === 'function' ? define : function (id, deps, factory) {
		factory(require('../../integration'), require('../../aggregators/batching'), require('../../channels/adhoc'));
	}
	// Boilerplate for AMD and Node
));

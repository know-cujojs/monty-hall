(function (buster, define) {
	"use strict";

	var integration, bus, assert, refute, fail, undef;

	assert = buster.assert;
	refute = buster.refute;
	fail = buster.assertions.fail;

	buster.testCase('integration/aggregators/correlating', {
		setUp: function (done) {
			if (integration) {
				bus = integration.bus();
				return done();
			}
			define('integration/aggregators/correlating-test', ['integration', 'integration/aggregators/correlating', 'integration/channels/adhoc', 'integration/channels/direct'], function (i) {
				integration = i;
				bus = integration.bus();
				done();
			});
		},
		tearDown: function () {
			bus.destroy();
		},

		'should aggregate split messages': function () {
			var upperCaseVowels, out;

			upperCaseVowels = this.spy(function (char) {
				return (/^[aeiou]$/).test(char) ?
					char.toUpperCase() :
					char;
			});
			out = this.spy(function (message) {
				assert.same('AbcdEfghIjklmnOpqrstUvwxyz', message);
			});

			bus.direct('in');
			bus.splitter(function (message) {
				return Array.prototype.slice.call(message.payload);
			}, { output: 'letters', input: 'in' });
			bus.direct('letters');
			bus.transform(function (message) {
				return upperCaseVowels(message);
			}, { output: 'vowled', input: 'letters' });
			bus.direct('vowled');
			bus.correlatingAggregator({ output: 'merge', input: 'vowled' });
			bus.direct('merge');
			bus.transform(function (message) {
				var str = '';
				message.forEach(function (message) {
					str += message.payload;
				}, this);
				return str;
			}, { output: 'out', input: 'merge' });
			bus.adhoc('out', bus.outboundAdapter(out));

			bus.send('in', 'abcdefghijklmnopqrstuvwxyz');

			assert.same(26, upperCaseVowels.callCount);
			assert.same(1, out.callCount);
		}
	});

}(
	this.buster || require('buster'),
	typeof define === 'function' ? define : function (id, deps, factory) {
		factory(require('../../integration'), require('../../aggregators/correlating'), require('../../channels/adhoc'), require('../../channels/direct'));
	}
	// Boilerplate for AMD and Node
));

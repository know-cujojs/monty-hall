(function (buster, define) {
	"use strict";

	var arrayBuffer, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	buster.testCase('clicks/stream/arrayBuffer', {
		setUp: function (done) {
			if (arrayBuffer) { return done(); }
			define('clicks/stream/arrayBuffer-test', ['clicks/stream/arrayBuffer'], function (a) {
				arrayBuffer = a;
				done();
			});
		},
		tearDown: function () {
			arrayBuffer.flush();
		},

		'should return events in the order they were recieved': function () {
			arrayBuffer('a');
			arrayBuffer('b');
			arrayBuffer('c');

			assert.equals(['a', 'b', 'c'], arrayBuffer.get());
		},
		'should return new arrays for each get call': function () {
			var buf1, buf2;

			arrayBuffer('a');
			buf1 = arrayBuffer.get();
			buf2 = arrayBuffer.get();

			refute.same(buf1, buf2);
			assert.equals(buf1, buf2);
		},
		'should empty the buffer on flush': function () {
			arrayBuffer('a');
			arrayBuffer.flush();
			arrayBuffer('b');

			assert.equals(['b'], arrayBuffer.get());
		}
	});

}(this.buster, define));

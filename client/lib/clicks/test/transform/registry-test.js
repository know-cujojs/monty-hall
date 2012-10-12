(function (buster, define) {
	"use strict";

	var registry, nodeTransform, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	buster.testCase('clicks/transform/_registry', {
		setUp: function (done) {
			if (registry) { return done(); }
			define('clicks/transform/registry-test', ['clicks/transform/_registry', 'clicks/transform/node'], function (r, n) {
				registry = r;
				nodeTransform = n;
				done();
			});
		},
		tearDown: function () {
			registry.reset();
		},

		'should have identity transform provided': function () {
			assert.same(49, registry.lookup('')(49));
		},
		'should have node transform provided': function () {
			assert.same(nodeTransform, registry.lookup('node'));
		},
		'should return undefined for an unknown lookup': function () {
			assert.same(undef, registry.lookup('foo')(49));
		},
		'should override provided transform': function () {
			registry.add('', function () { return 38; });
			assert.same(38, registry.lookup('')(49));
		},
		'should fail to redefined provided transform': function () {
			try {
				registry.addProvided('', function () {});
				assert(false, 'exception expected');
			}
			catch (e) {
				assert(e);
			}
		},
		'should flush transforms on reset while retaining provided transforms': function () {
			registry.addProvided('51', function () { return 51; });
			registry.add('38', function () { return 38; });
			assert.same(51, registry.lookup('51')(1));
			assert.same(38, registry.lookup('38')(1));
			registry.reset();
			assert.same(51, registry.lookup('51')(1));
			assert.same(undef, registry.lookup('38')(1));
		}
	});

}(this.buster, define));

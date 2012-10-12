/*global window:false */

(function (buster, define) {
	"use strict";

	var storageTransform, doc, tests, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	doc = window.document;

	tests = {
		setUp: function (done) {
			if (storageTransform) { return done(); }
			define('clicks/transform/storage-test', ['clicks/transform/storage'], function (s) {
				storageTransform = s;
				done();
			});
		},

		'should detect localStorage': function () {
			assert.equals('local', storageTransform(window.localStorage));
		},
		'should detect sessionStorage': function () {
			assert.equals('session', storageTransform(window.sessionStorage));
		},
		'should return undefined for unknown Storage': function () {
			assert.same(undef, storageTransform({}));
			assert.same(undef, storageTransform(undef));
		}
	};

	function defer(name) {
		if (!(name in tests)) { return; }
		tests['//' + name] = tests[name];
		delete tests[name];
	}

	if (!('localStorage' in window)) {
		defer('should detect localStorage');
	}
	if (!('sessionStorage' in window)) {
		defer('should detect sessionStorage');
	}
	try {
		if (window.localStorage === window.localStorage) {
			// should always be true, but throws in IE 8
		}
	}
	catch (e) {
		defer('should detect localStorage');
		defer('should detect sessionStorage');
	}

	buster.testCase('clicks/transform/storage', tests);

}(this.buster, define));

/*global window:false */

(function (buster, define) {
	"use strict";

	var clicks, storage, doc, tests, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	doc = window.document;

	function fireEvent(type, eventInterface, target, bubbles, cancelable) {
		if (arguments.length <= 3) {
			bubbles = true;
			cancelable = true;
		}

		var e;

		if (doc.createEvent) {
			e = doc.createEvent(eventInterface);
			e.initEvent(type, bubbles, cancelable);
			target.dispatchEvent(e);
		}
		else if (target.fireEvent) {
			e = doc.createEventObject();
			e.target = target;
			target.fireEvent('on' + type, e);
		}
		else {
			throw new Error('Unable to fire an event');
		}

		return e;
	}

	tests = {
		setUp: function (done) {
			if (clicks) { return done(); }
			define('clicks/events/storage-test', ['clicks', 'clicks/events/storage'], function (c, s) {
				clicks = c;
				storage = s;
				done();
			});
		},
		tearDown: function () {
			clicks.reset();
		},

		'should fire synthetic storage events': function () {
			var events;

			clicks.attach(storage.types);
			fireEvent('storage', 'StorageEvent', window);

			events = clicks();
			assert.same(1, events.length);
			assert.same('storage', events[0].type);
		},
		'//should fire trusted storage events': function () {
			var events;

			clicks.attach(storage.types);

			window.localStorage.setItem('foo', 'bar');
			window.localStorage.setItem('foo', 'baz');

			events = clicks();
			assert.same(1, events.length);
			assert.same('storage', events[0].type);
		}
	};

	function defer(name) {
		if (!(name in tests)) { return; }
		tests['//' + name] = tests[name];
		delete tests[name];
	}

	if (!('dispatchEvent' in window) && !('fireEvent' in window)) {
		defer('should fire synthetic storage events');
	}

	buster.testCase('clicks/events/storage', tests);

}(this.buster, define));

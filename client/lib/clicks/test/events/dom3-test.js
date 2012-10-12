(function (buster, define) {
	"use strict";

	var dom3, indexOf, tests, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	indexOf = Array.prototype.indexOf || function indexOf(item) {
		for (var i = 0; i < this.length; i += 1) {
			if (i in this && item === this[i]) {
				return i;
			}
		}
	};

	tests = {
		setUp: function (done) {
			if (dom3) { return done(); }
			define('clicks/events/dom3-test', ['clicks/events/dom3'], function (d) {
				dom3 = d;
				done();
			});
		},

		'should contain the super set of all categories as types': function () {
			var category, type;

			for (category in dom3.categories) {
				for (type in dom3.categories[category]) {
					assert.same(dom3.types[type], dom3.categories[category][type]);
				}
			}
		},
		'should mirror the spec event heirarchy for event properties': function () {
			var props = dom3.properties;

			assert.same(props.userInterface, Object.getPrototypeOf(props.composition));
			assert.same(props.event, Object.getPrototypeOf(props.custom));
			assert.same(props.userInterface, Object.getPrototypeOf(props.focus));
			assert.same(props.userInterface, Object.getPrototypeOf(props.keyboard));
			assert.same(props.userInterface, Object.getPrototypeOf(props.mouse));
			assert.same(props.event, Object.getPrototypeOf(props.userInterface));
			assert.same(props.mouse, Object.getPrototypeOf(props.wheel));
		},
		'should have a known attachPoint for every event type': function () {
			var type, attachPoints;

			attachPoints = ['window', 'document', 'html', 'head', 'body'];

			for (type in dom3.types) {
				assert(indexOf.call(attachPoints, dom3.types[type].attachPoint) >= 0);
			}
		},
		'should extend from a known property set for every event type': function () {
			var type, propertySets;

			propertySets = [
				dom3.properties.event,
				dom3.properties.composition,
				dom3.properties.custom,
				dom3.properties.focus,
				dom3.properties.keyboard,
				dom3.properties.mouse,
				dom3.properties.userInterface,
				dom3.properties.wheel
			];

			for (type in dom3.types) {
				assert(indexOf.call(propertySets, Object.getPrototypeOf(dom3.types[type].properties)) >= 0);
			}
		},
		'should not have own properties in the property set for every event type': function () {
			var type, prop;

			for (type in dom3.types) {
				for (prop in dom3.types[type].properties) {
					refute(dom3.types[type].properties.hasOwnProperty(prop));
				}
			}
		}
	};

	function defer(name) {
		if (!(name in tests)) { return; }
		tests['//' + name] = tests[name];
		delete tests[name];
	}

	if (!('getPrototypeOf' in Object)) {
		defer('should mirror the spec event heirarchy for event properties');
		defer('should extend from a known property set for every event type');
	}

	buster.testCase('clicks/events/dom3', tests);

}(this.buster, define));

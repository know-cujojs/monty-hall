(function (buster) {
	"use strict";

	var assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	buster.assertions.add("frozen", {
		assert: function (actual) {
			return actual instanceof Object && Object.isFrozen ? Object.isFrozen(actual) : true;
		},
		refute: function (actual) {
			return actual instanceof Object && Object.isFrozen ? !Object.isFrozen(actual) : true;
		},
		assertMessage: "Expected ${0} to be frozen",
		refuteMessage: "Expected ${0} to not be frozen"
	});

	buster.assertions.add("empty", {
		assert: function (actual) {
			return 'length' in actual && actual.length === 0;
		},
		assertMessage: "Expected ${0} to be empty",
		refuteMessage: "Expected ${0} to not be empty"
	});

}(
	this.buster || require('buster')
));

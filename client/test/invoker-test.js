var buster, invoker, assert, refute;

buster = require('buster');
invoker = require('../../client/app/invoker');

assert = buster.assert;
refute = buster.refute;

buster.testCase('invoker', {

	'should return a function': function() {
		assert.isFunction(invoker('foo', []));
	},

	'should invoke method on target': function() {
		var i, fixture, expected, result;

		expected = {};
		fixture = {
			method: this.stub().returns(expected)
		};

		i = invoker('method', [expected]);

		result = i(fixture);

		assert.calledOnceWith(fixture.method, expected);
		assert.same(result, expected);
	}

});
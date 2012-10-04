var buster, createThenGetInterceptor, assert, refute;

buster = require('buster');
createThenGetInterceptor = require('../../../client/app/api/createThenGetInterceptor');

assert = buster.assert;
refute = buster.refute;

buster.testCase('createThenGetInterceptor', {

	'should return promise for original response when location header not present': function(done) {
		var client, fakeResponse, interceptor;

		fakeResponse = { headers: {} };
		client = this.stub().returns(fakeResponse);

		interceptor = createThenGetInterceptor(client);
		interceptor({ method: 'POST', path: 'test' }).then(function(response) {
			refute.calledTwice(client);
			assert.equals(response, fakeResponse);
		}).then(done, done);
	},

	'should call client to fetch newly created entity': function(done) {
		var client, fakeResponse, interceptor;

		fakeResponse = { headers: { Location: 'test/1' }};
		client = this.stub().returns(fakeResponse);

		interceptor = createThenGetInterceptor(client);
		interceptor({ method: 'POST', path: 'test' }).then(function(response) {
			assert.calledTwice(client);
			assert.equals(client.secondCall.args(0), { path: 'test/1' });
		}).then(done, done);
	}

});
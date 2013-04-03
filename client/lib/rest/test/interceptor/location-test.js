/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;

	define('rest/interceptor/location-test', function (require) {

		var location, rest;

		location = require('rest/interceptor/location');
		rest = require('rest');

		buster.testCase('rest/interceptor/location', {
			'should follow the location header': function (done) {
				var client, spy;
				spy = this.spy(function (request) {
					var response = { request: request, headers: {  } };
					if (spy.callCount < 3) {
						response.headers.Location = '/foo/' + spy.callCount;
					}
					return response;
				});
				client = location(spy);
				client({}).then(function (response) {
					refute(response.headers.Location);
					assert.same(3, spy.callCount);
					assert.same(spy.returnValues[0].headers.Location, '/foo/1');
					assert.same(spy.args[1][0].path, '/foo/1');
					assert.same(spy.args[1][0].method, 'GET');
					assert.same(spy.returnValues[1].headers.Location, '/foo/2');
					assert.same(spy.args[2][0].path, '/foo/2');
					assert.same(spy.args[2][0].method, 'GET');
					refute(spy.returnValues[2].headers.Location);
				}).otherwise(fail).ensure(done);
			},
			'should return the response if there is no location header': function (done) {
				var client, spy;
				spy = this.spy(function () { return { status: { code: 200 } }; });
				client = location(spy);
				client({}).then(function (response) {
					assert.equals(200, response.status.code);
					assert.same(1, spy.callCount);
				}).otherwise(fail).ensure(done);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, location().skip());
			},
			'should support interceptor chaining': function () {
				assert(typeof location().chain === 'function');
			}
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (id, factory) {
		var packageName = id.split(/[\/\-]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
		pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
		factory(function (moduleId) {
			return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
		});
	}
	// Boilerplate for AMD and Node
));
var buster, entityParser, assert, refute, entityFixture, entityListFixture;

buster = require('buster');
entityParser = require('../../../client/app/api/entityParser');

assert = buster.assert;
refute = buster.refute;

entityFixture = {
	links: [
		{ rel: 'self', href: '1' },
		{ rel: 'things', href: '2' }
	],
	prop1: 'prop1',
	prop2: 123
};

entityListFixture = {
	links: [
		{ rel: 'self', href: '1' }
	],
	things: [
		entityFixture,
		entityFixture,
		entityFixture
	]
};

function fakeEntityClient() {
	return {
		entity: entityFixture
	};
}

function fakeEntityListClient() {
	return {
		entity: entityListFixture
	};
}

function noop() {}

buster.testCase('entityParser', {
	'should parse entity': function() {
		var parser, parsed;

		parser = entityParser(noop);
		parsed = parser.parseEntity(entityFixture);
		
		assert.equals(parsed.prop1, entityFixture.prop1);
		assert.equals(parsed.prop2, entityFixture.prop2);
		assert.isFunction(parsed.things.get);
	},

	'should parse entity list': function() {
		var parser, parsed;

		parser = entityParser(noop);
		parsed = parser.parseEntityList('things', entityListFixture);

		assert.isArray(parsed);
		assert.equals(parsed.length, entityListFixture.things.length);

		parsed.forEach(function(parsed) {
			assert.equals(parsed.prop1, entityFixture.prop1);
			assert.equals(parsed.prop2, entityFixture.prop2);
			assert.isFunction(parsed.things.get);
		});
	}
});
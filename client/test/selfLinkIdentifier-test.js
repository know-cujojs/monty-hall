var buster, selfLinkIdentifier, assert, refute;

buster = require('buster');
selfLinkIdentifier = require('../../client/app/selfLinkIdentifier');

assert = buster.assert;
refute = buster.refute;

buster.testCase('selfLinkIdentifier', {
	'should return first rel="self" with valid link href': function() {
		var item = { links: [
			{ rel: 'foo', href: 'fail' },
			{ rel: 'self' },
			{ rel: 'self', href: 'ok' },
			{ rel: 'foo', href: 'fail' },
			{ rel: 'self', href: 'fail' }
		]};

		assert.equals(selfLinkIdentifier(item), 'ok');
	},

	'should return undefined if no rel="self" links': function() {
		var item = { links: [
			{ rel: 'foo', href: 'fail' },
			{ rel: 'bar', href: 'fail' },
			{ rel: 'foo', href: 'fail' },
			{ rel: 'baz', href: 'fail' }
		]};

		refute.defined(selfLinkIdentifier(item));
	},

	'should return first rel="self" link href': function() {
		var item = { links: [
			{ rel: 'foo', href: 'fail' },
			{ rel: 'self', href: 'ok' },
			{ rel: 'foo', href: 'fail' },
			{ rel: 'self', href: 'fail' }
		]};

		assert.equals(selfLinkIdentifier(item), 'ok');
	},

	'should return undefined if zero links': function() {
		refute.defined(selfLinkIdentifier({ links: []}));
	},

	'should return undefined if no rel="self" links have valid hrefs': function() {
		refute.defined(selfLinkIdentifier({ links: [
			{ rel: 'self' },
			{ rel: 'self' }
		]}));
	},

	'should return undefined if links missing': function() {
		refute.defined(selfLinkIdentifier({}));
	}

});
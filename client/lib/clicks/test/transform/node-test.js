/*global window:false */

(function (buster, define) {
	"use strict";

	var nodeTransform, doc, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	doc = window.document;

	buster.testCase('clicks/transform/node', {
		setUp: function (done) {
			if (nodeTransform) { return done(); }
			define('clicks/transform/node-test', ['clicks/transform/node'], function (n) {
				nodeTransform = n;
				done();
			});
		},

		'should create element hierarchy including IDs and classes, ignoring non element nodes': function () {
			var fragment, html, head, body, text;

			fragment = doc.createDocumentFragment();
			html = doc.createElement('html');
			head = doc.createElement('head');
			body = doc.createElement('body');
			// class whitespace ugliness is part of the test
			body.innerHTML = "<div class=' foo  bar '><ul id='list'><li id='item' class='the-item'>text</li></ul></div>";
			html.appendChild(head);
			html.appendChild(body);
			fragment.appendChild(html);

			text = html.getElementsByTagName('li')[0].firstChild;
			assert.same(doc.TEXT_NODE || 3, text.nodeType);
			assert.equals('HTML BODY DIV.bar.foo UL#list LI#item.the-item', nodeTransform(text));
		}
	});

}(this.buster, define));

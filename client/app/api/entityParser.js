(function(define) {
define(function(require) {

	var hasOwn, createInterceptor, when, entityParser;

	when = require('when');
	createInterceptor = require('rest-template/interceptor/_base');

	hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

	function createEntityParser(client) {
		var parser, interceptor;

		parser = Object.create(entityParser, {
			_createGetter: {
				value: createGetter
			}
		});

		interceptor = entityParserInterceptor(client, parser);

		return parser;

		function createGetter(url) {
			return function() {
				return interceptor({ path: url });
			};
		}

	}

	entityParser = {
		parseEntity: function(data) {
			var entity = {};

			Object.keys(data).forEach(function(key) {
				if(key === 'links') {
					this.parseLinks(data[key], entity);
				} else {
					entity[key] = data[key];
				}
			}.bind(this));

			return entity;
		},

		parseEntityList: function(name, data) {
			var list = data[name];

			return Array.isArray(list)
				? list.map(this.parseEntity.bind(this))
				: [];
		},

		parseLinks: function(links, entity) {
			return links.reduce(function(entity, link) {
				var name;

				name = link.rel;

				if(!hasOwn(entity, name)) {
					entity[name] = {
						href: link.href,
						get: this._createGetter(link.href)
					};
				}

				return entity;
			}.bind(this), entity);
		}
	};

	return createEntityParser;

	function entityParserInterceptor(client, parser) {

		return createInterceptor({
			response: function(response, config) {
				if(!('entity' in response)) {
					return response;
				}

				return parser.parseEntity(response.entity);
			}
		});
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
(function(define) {
define(function(require) {

	var hasOwn, entityParserInterceptor, entityParser;

	entityParserInterceptor = require('./entityParserInterceptor');
	hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

	function createEntityParser(client) {
		var parser, interceptor;

		parser = Object.create(entityParser, {
			_createGetter: {
				value: createGetter
			},
			_createUpdater: {
				value: createUpdater
			}
		});

		interceptor = entityParserInterceptor(client, { entityParser: parser });

		return parser;

		function createUpdater() {
			return function(data) {
				var url = data.links[0].href;
				return interceptor({ method: 'PUT', path: url, entity: data });
			};
		}

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

				if(name === 'self') {
					entity.update = this._createUpdater();
				}

				if(!hasOwn(entity, name)) {
					entity[name] = {
						href: link.href,
						get: this._createGetter(link.href),
						update: this._createUpdater()
					};
				}

				return entity;
			}.bind(this), entity);
		}
	};

	return createEntityParser;

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
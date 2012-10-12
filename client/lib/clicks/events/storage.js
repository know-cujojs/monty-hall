define(['./dom3', '../utils', '../transform/_registry', '../transform/storage'], function (dom3, utils, transforms, storageTransform) {
	"use strict";

	// implemented to http://www.w3.org/TR/2011/CR-webstorage-20111208/

	var events, prop, cat, types;

	events = {};
	events.properties = prop = {};

	function StorageEvent() {
		this.key = '';
		this.oldValue = '';
		this.newValue = '';
		this.url = '';
		this.storageArea = 'storage';
	}
	StorageEvent.prototype = dom3.properties.Event;
	prop.storage = new StorageEvent();

	events.categories = cat = {
		storage: {
			storage: {
				attachPoint: 'window',
				properties: utils.beget(prop.storage)
			}
		}
	};

	events.types = types = utils.mixin({}, cat.storage);

	transforms.addProvided('storage', storageTransform);

	return events;

});

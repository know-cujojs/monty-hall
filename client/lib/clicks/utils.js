define([], function () {
	"use strict";

	function Beget() {}

	/**
	 * Mix properties from other object into the target
	 * @param target the object to recieve mixed in properties
	 * @param [suppliment] 1..n objects whose properties are mixed in
	 * @return the target object
	 */
	function mixin(target) {
		var i, suppliment, prop;

		for (i = 1; i < arguments.length; i += 1) {
			suppliment = arguments[i];
			for (prop in suppliment) {
				if (!(prop in target)) {
					target[prop] = suppliment[prop];
				}
			}
		}

		return target;
	}

	/**
	 * Create a new object with the provided properties in it's prototype chain
	 * @param proto the properties to make available
	 * @return the new object
	 */
	function beget(proto) {
		Beget.prototype = proto;
		var tmp = new Beget();
		Beget.prototype = null;
		return tmp;
	}

	return {
		mixin: mixin,
		beget: beget
	};

});

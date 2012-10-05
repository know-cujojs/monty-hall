/*global window:false */

define([], function () {
	"use strict";

	var types, undef;

	types = {
		localStorage: 'local',
		sessionStorage: 'session'
	};

	/**
	 * Attempts to detect which type of storage this object represents: 'session' or 'local'.
	 * @param storage the storage object
	 * @returns the type of storage, or undefined when unknown.
	 */
	function storageTransform(storage) {
		var type;

		try {
			for (type in types) {
				if (type in window && window[type] === storage) {
					return types[type];
				}
			}
		}
		catch (e) {
			// IE8 can throw, ignore
		}

		return undef;
	}

	return storageTransform;

});

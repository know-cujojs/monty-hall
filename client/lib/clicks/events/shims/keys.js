define(['../dom3', '../../utils'], function (dom3, utils) {
	"use strict";

	var keyboardProps, keyboardCat, types, loaded, escaped;

	keyboardProps = dom3.properties.keyboard;
	keyboardCat = dom3.categories.keyboard;
	types = dom3.types;
	loaded = false;
	// from Crockford's json.js https://github.com/douglascrockford/JSON-js/blob/master/json.js
	escaped = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;


	function upgradeKeyEvent(safe, raw) {
		if ('key' in safe || 'char' in safe) {
			// mondern values are present
			return;
		}
		else if (!('keyCode' in safe && 'charCode' in safe)) {
			// legacy values are absent
			return;
		}
		var char = String.fromCharCode(safe.charCode);
		if (escaped.test(char)) {
			safe.char = '';
			safe.key = 'Unidentified';
		}
		else {
			safe.char = char;
			safe.key = char;
		}
	}

	/**
	 * Enable the key events shim
	 *
	 * - adds keypress to dom3 keyboard
	 * - captures keyCode, charCode and type KeyboardEvent properties
	 * - attemps to normalize legacy keyCode and charCode properties (experimental)
	 */
	function load() {
		if (loaded) { return; }

		keyboardProps.charCode = 'key';
		keyboardProps.keyCode = 'key';
		keyboardProps.which = 'key';
		keyboardProps._postTransform = upgradeKeyEvent;

		types.keypress = keyboardCat.keypress = {
			attachPoint: 'document',
			properties: utils.beget(keyboardProps)
		};

		loaded = true;
	}

	/**
	 * Disable the key events shim
	 */
	function remove() {
		if (!loaded) { return; }

		delete keyboardProps.charCode;
		delete keyboardProps.keyCode;
		delete keyboardProps.which;
		delete keyboardProps._postTransform;

		delete types.keypress;
		delete keyboardCat.keypress;

		loaded = false;
	}

	function isLoaded() {
		return loaded;
	}

	return {
		load: load,
		remove: remove,
		isLoaded: isLoaded
	};

});

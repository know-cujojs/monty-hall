/*global window:false */

define(['./node'], function (nodeTransform) {
	"use strict";

	var transforms, providedTransforms, undef;

	transforms = {};
	providedTransforms = {};

	/**
	 * A transform that always returns undefined
	 * @return undefined
	 */
	function undefinedTransform() {
		return undef;
	}

	/**
	 * A no-op transform
	 * @param item item to transform
	 * @returns the item, unmodified
	 */
	function identityTransform(item) {
		return item;
	}

	/**
	 * Registers a provided transform. Provided transforms provide a default
	 * for a property type that may be overridden. Only one provided transform
	 * may be registered per type. Provided transfors are never removed.
	 * @param name the property type to apply this transform for
	 * @param func the transform function
	 * @throws if the property type is already registered
	 */
	function addProvided(name, func) {
		if (name in providedTransforms) {
			// cannot override a default
			throw new Error("'" + name + "' is already registered as a provided transform");
		}
		providedTransforms[name] = func;
	}

	/**
	 * Registers, or overrides, a new transform
	 * @param name the property type to apply this transform for
	 * @param func the transform function
	 */
	function add(name, func) {
		transforms[name] = func;
	}

	/**
	 * Lookup the transform function for property type. If unable to find a
	 * match, the undefined transform is used.
	 * @param name the property type
	 * @return the transform function
	 */
	function lookup(name) {
		if (name in transforms) {
			return transforms[name];
		}
		else if (name in providedTransforms) {
			return providedTransforms[name];
		}
		return undefinedTransform;
	}

	/**
	 * Remove all custom tranforms, preserving provided transforms
	 */
	function reset() {
		transforms = {};
	}

	providedTransforms[''] = identityTransform;
	providedTransforms.node = nodeTransform;

	return {
		add: add,
		addProvided: addProvided,
		lookup: lookup,
		reset: reset
	};

});

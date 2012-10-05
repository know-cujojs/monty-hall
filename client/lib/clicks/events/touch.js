define(['./dom3', '../utils', '../transform/_registry', '../transform/touchlist'], function (dom3, utils, transforms, touchlistTransform) {
	"use strict";

	// implemented to http://www.w3.org/TR/2011/CR-touch-events-20111215/
	// gestures to https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/GestureEventClassReference/GestureEvent/GestureEvent.html#//apple_ref/javascript/cl/GestureEvent

	var events, prop, cat, types;

	events = {};
	events.properties = prop = {};

	function TouchEvent() {
		this.touches = 'touchlist';
		this.targetTouches = 'touchlist';
		this.changedTouches = 'touchlist';
		this.altKey = '';
		this.metaKey = '';
		this.ctrlKey = '';
		this.shiftKey = '';
	}
	TouchEvent.prototype = dom3.properties.UIEvent;
	prop.touch = new TouchEvent();

	function GestureEvent() {
		this.altKey = '';
		this.metaKey = '';
		this.ctrlKey = '';
		this.rotation = '';
		this.scale = '';
		this.shiftKey = '';
	}
	GestureEvent.prototype = dom3.properties.UIEvent;
	prop.gesture = new GestureEvent();

	events.categories = cat = {
		touch: {
			touchstart: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			},
			touchend: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			},
			touchmove: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			},
			touchcancel: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			}
		},
		gesture: {
			gesturestart: {
				attachPoint: 'document',
				properties: utils.beget(prop.gesture)
			},
			gesturechange: {
				attachPoint: 'document',
				properties: utils.beget(prop.gesture)
			},
			gestureend: {
				attachPoint: 'document',
				properties: utils.beget(prop.gesture)
			}
		}
	};

	events.types = types = utils.mixin({}, cat.touch, cat.gesture);

	transforms.addProvided('touchlist', touchlistTransform);

	return events;

});

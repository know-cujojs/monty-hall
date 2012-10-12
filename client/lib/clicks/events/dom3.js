define(['../utils', '../transform/_registry'], function (utils, transforms) {
	"use strict";

	// implemented to http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/

	var events, prop, cat, types;

	events = {};
	events.properties = prop = {};

	function Event() {
		this.type = '';
		this.timeStamp = '';
		this.target = 'node';
		this.isTrusted = '';
	}
	Event.prototype = null;
	prop.event = new Event();

	function CustomEvent() {
		this.detail = '';
	}
	CustomEvent.prototype = prop.event;
	prop.custom = new CustomEvent();

	function UIEvent() {}
	UIEvent.prototype = prop.event;
	prop.userInterface = new UIEvent();

	function FocusEvent() {
		this.relatedTarget = 'node';
	}
	FocusEvent.prototype = prop.userInterface;
	prop.focus = new FocusEvent();

	function MouseEvent() {
		this.screenX = '';
		this.screenY = '';
		this.clientX = '';
		this.clientY = '';
		this.ctrlKey = '';
		this.shiftKey = '';
		this.altKey = '';
		this.metaKey = '';
		this.button = '';
		this.buttons = '';
		this.relatedTarget = 'node';
	}
	MouseEvent.prototype = prop.userInterface;
	prop.mouse = new MouseEvent();

	function WheelEvent() {
		this.deltaX = '';
		this.deltaY = '';
		this.deltaZ = '';
		this.deltaMode = '';
	}
	WheelEvent.prototype = prop.mouse;
	prop.wheel = new WheelEvent();

	function KeyboardEvent() {
		this.char = 'key';
		this.key = 'key';
		this.location = 'key';
		this.ctrlKey = '';
		this.shiftKey = '';
		this.altKey = '';
		this.metaKey = '';
		this.repeat = '';
		this.locale = '';
	}
	KeyboardEvent.prototype = prop.userInterface;
	prop.keyboard = new KeyboardEvent();

	function CompositionEvent() {
		this.data = '';
		this.locale = '';
	}
	CompositionEvent.prototype = prop.userInterface;
	prop.composition = new CompositionEvent();


	events.categories = cat = {
		userInterface: {
			load: {
				attachPoint: 'window',
				properties: utils.beget(prop.event)
			},
			unload: {
				attachPoint: 'window',
				properties: utils.beget(prop.event)
			},
			abort: {
				attachPoint: 'html',
				properties: utils.beget(prop.event)
			},
			error: {
				attachPoint: 'html',
				properties: utils.beget(prop.event)
			},
			select: {
				attachPoint: 'html',
				properties: utils.beget(prop.event)
			},
			resize: {
				attachPoint: 'window',
				properties: utils.beget(prop.userInterface)
			},
			scroll: {
				attachPoint: 'window',
				properties: utils.beget(prop.userInterface)
			}
		},
		focus: {
			blur: {
				attachPoint: 'html',
				properties: utils.beget(prop.focus)
			},
			focus: {
				attachPoint: 'html',
				properties: utils.beget(prop.focus)
			},
			focusin: {
				attachPoint: 'html',
				properties: utils.beget(prop.focus)
			},
			focusout: {
				attachPoint: 'html',
				properties: utils.beget(prop.focus)
			}
		},
		mouse: {
			click: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			dblclick: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			mousedown: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			mouseenter: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			mouseleave: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			mousemove: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			mouseover: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			mouseout: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			},
			mouseup: {
				attachPoint: 'html',
				properties: utils.beget(prop.mouse)
			}
		},
		wheel: {
			wheel: {
				attachPoint: 'window',
				properties: utils.beget(prop.wheel)
			}
		},
		keyboard: {
			// keypress is available in ./shims/keys
			keydown: {
				attachPoint: 'document',
				properties: utils.beget(prop.keyboard)
			},
			keyup: {
				attachPoint: 'document',
				properties: utils.beget(prop.keyboard)
			}
		},
		composition: {
			compositionstart: {
				attachPoint: 'html',
				properties: utils.beget(prop.composition)
			},
			compositionupdate: {
				attachPoint: 'html',
				properties: utils.beget(prop.composition)
			},
			compositionend: {
				attachPoint: 'html',
				properties: utils.beget(prop.composition)
			}
		}
	};

	events.types = types = utils.mixin({},
		cat.userInterface,
		cat.focus,
		cat.mouse,
		cat.wheel,
		cat.keyboard,
		cat.composition);

	cat.stormy = {
		mousemove: types.mousemove,
		resize: types.resize,
		scroll: types.scroll
	};

	transforms.addProvided('key', function (value) { return value; });

	return events;

});

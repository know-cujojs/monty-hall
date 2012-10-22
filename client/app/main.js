define({

	// One important tenant of cujojs is OOCSS/SMACSS which separates
	// theme ("skin" in OOCSS terminology) from structure.  This allows
	// themes to be applied separately from integral, structural css.
	theme: { module: 'css!theme/base.css' },

	// Root html node where we'll render all of the game UI
	root: {
		render: {
			template: { module: 'text!app/container/template.html' }
		},
		insert: { last: { $ref: 'dom.first!body' } }
	},

	// Game template that lays out DOM containers into which we'll put
	// each individual view, i.e. each piece of the UI
	gameView: {
		render: {
			template: { module: 'text!app/game/template.html' }
		},
		insert: { last: 'root' }
	},

	// The big gameshow title view
	marqueeView: {
		render: {
			template: { module: 'text!app/marquee/template.html' },
			replace: { module: 'i18n!app/marquee/strings' },
			at: { $ref: 'dom.first!.marquee', at: 'gameView' }
		}
	},

	// The game instructions view that walks the user through playing
	// the game.  Note how this uses OOCSS/SMACSS to display the
	// different steps (see gameStateOocssHandler).
	instructionsNode: { $ref: 'dom.first!.instructions', at: 'gameView' },
	instructionsView: {
		wire: {
			spec: 'app/instructions/spec',
			provide: {
				$root: { $ref: 'instructionsNode' }
			}
		}
	},

	// The main game controller that handles door clicks, and interacts
	// with the game API and publishes door changes from the server to the
	// observable door data that drives the views.
	controller: {
		create: 'app/game/controller',
		properties: {
			_updateDoor: { compose: 'doors.update' },
			gameApi: { $ref: 'gameApi' }
		},
		on: {
			doorsView: {
				'click:.doorway': 'doors.findItem | selectDoor'
			}
		},
		afterResolving: {
			'_startGame': 'clientForClicksInvoker | clickStream.start'
		},
		ready: '_startGame'
	},

	// A wire invoker that will call clientFor('clicks') on whatever
	// is passed to it.  We use it as a connection transform to get the
	// clicks client for the newly started game.  See the afterResolving above
	clientForClicksInvoker: {
		invoker: {
			method: 'clientFor', args: ['clicks']
		}
	},

	// Client interface to the game server API
	gameApi: { wire: 'app/game/rest' },
	// FOR TESTING: Fake implementation of the client game API interface
	// that can be used for testing.
//	gameApi: { wire: 'app/game/fake' },

	// Data driven view of the doors that is bound to the doors data.
	// When door data changes (be it from the server or local), the changes
	// will be reflected in the view based on the bindings
	doorsView: {
		render: {
			template: { module: 'text!app/doors/template.html' },
			// replace: { module: 'i18n!doors/strings' },
			css: { module: 'css!app/doors/structure.css' },
			at: { $ref: 'dom.first!.doors', at: 'gameView' }
		},
		bind: {
			to: { $ref: 'doors' },
			bindings: {
				status: { handler: { $ref: 'statusClassHandler' } },
				content: { selector: '.content', each: { $ref: 'contentClassHandler' } }

			},
			identifier: { $ref: 'selfLinkId' },
			comparator: { $ref: 'byId' }
		}
	},

	// Observable door data to which the doorsView is bound. Updates
	// to this will be reflected in the view and vice versa
	doors: { create: 'cola/Hub' },

	// Click stream aggregator for analytics
	clickStream: { create: 'app/game/clickStream' },

	// Function that extracts ids for data objects
	selfLinkId: { module: 'app/selfLinkIdentifier' },

	// Comparator used to sort doors. In this case we just sort by id, since
	// the ids are ascending numeric
	byId: {
		create: {
			module: 'app/byId',
			args: { $ref: 'selfLinkId' }
		}
	},

	// Data binding handler that ensures exactly one of the supplied
	// classes is set on a node. Above, this is bound to the door status
	// field.
	statusClassHandler: {
		create: {
			module: 'app/classSingleton',
			args: ['closed', 'opened', 'selected']
		}
	},

	// Similar data binding handler for the door content field
	contentClassHandler: {
		create: {
			module: 'app/classSingleton',
			args: ['unknown', 'small-furry-animal', 'juergen']
		}
	},

	// When the player selects a door, the game must re-query the game state
	// to know what to do next.  This handler is connected to the controller's
	// selectDoor using promise-aware AOP.  After the promise returned by
	// selectDoor has resolved, this will get the current game status
	// and hand it to gameStateMapper below.
	gameStateOocssHandler: {
		literal: {},
		properties: {
			setGameState: { compose: 'controller.getStatus | gameStateMapper' }
		},
		afterResolving: {
			'controller.selectDoor': 'setGameState'
		},
		// we need to run setGameState at "ready" since the
		// controller's "ready" may be called before our
		// "afterResolving" advice is applied
		ready: 'setGameState'
	},

	// Create a CSS mapper that translates game state constants into
	// css class names and manages the classes on the root game node.
	gameStateMapper: {
		create: {
			module: 'wire/dom/transform/mapClasses',
			args: {
				node: { $ref: 'root' },
				map: {
					AWAITING_INITIAL_SELECTION: 'awaiting-initial-selection' ,
					AWAITING_FINAL_SELECTION: 'awaiting-final-selection',
					WON: 'won',
					LOST: 'lost'
				}
			}
		}
	},

	plugins: [
		// { module: 'wire/debug' },
		{ module: 'wire/sizzle', classes: { init: 'loading' }},
		// { module: 'wire/dom', classes: { init: 'loading' }},
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'cola' }
	]
});
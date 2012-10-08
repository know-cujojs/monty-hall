define({

	root: {
		render: {
			template: { module: 'text!app/container/template.html' }
			//replace: { module: 'i18n!app/container/strings' },
			//css: { module: 'css!app/container/structure.css' }
		},
		insert: { last: { $ref: 'dom.first!body' } }
	},

	gameView: {
		render: {
			template: { module: 'text!app/game/template.html' }
			//replace: { module: 'i18n!app/game/strings' },
			//css: { module: 'css!app/game/structure.css' }
		},
		insert: { last: 'root' }
	},

	instructionsView: {
		render: {
			template: { module: 'text!app/instructions/template.html' },
			replace: { module: 'i18n!app/instructions/strings' },
			css: { module: 'css!app/instructions/structure.css' },
			at: { $ref: 'dom.first!.instructions', at: 'gameView' }
		}
	},

	controller: {
		create: 'app/game/controller',
		properties: {
			doors: { $ref: 'doors' },
			gameApi: { $ref: 'gameApi' }
		},
		on: {
			doorsView: {
				'click:.door,.doorway': 'doors.findItem | selectDoor'
			}
		},
		ready: '_startGame'
	},

	gameApi: { wire: 'app/game/rest' },

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

	doors: { create: 'cola/Hub' },

	doorsData: {
		literal: [],
		bind: {
			to: { $ref: 'doors' },
			identifier: { $ref: 'selfLinkId' },
			comparator: { $ref: 'byId' }
		}
	},

	history: { create: 'cola/Hub' },

	historyData: {
		literal: {
			links: [ { rel: 'self', href: 'http://localhost:8080/monty-hall/games/2863629425905948275/history' } ],
			events: [
				'SELECTED_DOOR_ONE',
				'REVEALED_DOOR_THREE',
				'SELECTED_DOOR_TWO',
				'WON'
			]
		},
		bind: {
			to: { $ref: 'history' }
		}
	},

	selfLinkId: { module: 'app/selfLinkIdentifier' },

	byId: {
		create: {
			module: 'app/byId',
			args: { $ref: 'selfLinkId' }
		}
	},

	statusClassHandler: {
		create: {
			module: 'app/classSingleton',
			args: ['closed', 'opened', 'selected']
		}
	},

	contentClassHandler: {
		create: {
			module: 'app/classSingleton',
			args: ['unknown', 'small-furry-animal', 'juergen']
		}
	},

	theme: { module: 'css!theme/base.css' },

	oocssHandler: {
		literal: {},
		properties: {
			setGameState: { compose: 'controller.getStatus | gameStateMapper' }
		},
		afterResolving: {
			'controller._startGame': 'setGameState',
			'controller._selectInitialDoor': 'setGameState',
			'controller._switchOrStay': 'setGameState'
		},
		// we need to run setGameState at "ready" since the
		// controller's "ready" may be called before our
		// "afterResolving" advice is applied
		ready: 'setGameState'
	},

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
//		{ module: 'wire/debug' },
		{ module: 'wire/dom', classes: { init: 'loading' }},
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'cola' }
	]
});
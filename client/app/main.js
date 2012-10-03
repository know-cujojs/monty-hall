define({

	root: { $ref: 'dom!game' },

	controller: {
		create: 'app/game/controller',
		properties: {
			doors: { $ref: 'doors' }
		},
		on: {
			doorsView: {
				'click:.door,.doorway': 'doors.findItem | selectDoor'/*,
				'dblclick:.door,.doorway': 'doors.findItem | openDoor'*/
			}
		},
		ready: '_startGame'
	},

	doorsView: {
		render: {
			template: { module: 'text!app/doors/template.html' },
			// replace: { module: 'i18n!doors/strings' },
			css: { module: 'css!app/doors/structure.css' }
		},
		bind: {
			to: { $ref: 'doors' },
			bindings: {
				status: { handler: { $ref: 'statusClassHandler' } },
				content: { selector: '.content', each: { $ref: 'contentClassHandler' } }

			},
			identifier: { $ref: 'selfLinkId' },
			comparator: { $ref: 'byId' }
		},
		insert: { at: 'root' }
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
		prototype: {},
		properties: {
			setGameStatus: { compose: 'controller.getStatus | setGameState' },
			setGameState: { $ref: 'gameStateMapper' }
		},
		afterResolving: {
			'controller._startGame': 'setGameStatus'
		}
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
		//{ module: 'wire/debug', trace: true },
		{ module: 'wire/dom', classes: { init: 'loading' }},
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'cola' }
	]
});
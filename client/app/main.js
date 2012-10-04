define({

	root: { $ref: 'dom!game' },

	controller: {
		create: 'app/game/controller',
		properties: {
			doors: { $ref: 'doors' },
			_doCreateGame: { $ref: 'gameClient' }
		},
		on: {
			doorsView: {
				'click:.door,.doorway': 'doors.findItem | selectDoor'/*,
				'dblclick:.door,.doorway': 'doors.findItem | openDoor'*/
			}
		},
		afterResolving: {
			'_startGame': 'getStatus | oocssHandler.setGameState'
		},
		ready: '_startGame'
	},

	baseClient: { $ref: 'client!http://monty-hall.cloudfoundry.com/games', entity: false },

	entityParser: {
		create: {
			module: 'app/api/entityParser',
			args: { $ref: 'baseClient' }
		}
	},

	gameClient: {
		create: {
			module: 'app/api/entityParserInterceptor',
			args: [
				{
					create: {
						module: 'app/api/createThenGetInterceptor',
						args: { $ref: 'baseClient' }
					}
				},
				{ entityParser: { $ref: 'entityParser'} }
			]
		}
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
		literal: {},
		properties: {
			setGameState: { $ref: 'gameStateMapper' }
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
		{ module: 'wire/debug', trace: { filter: '_startGame' } },
		{ module: 'wire/dom', classes: { init: 'loading' }},
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'rest-template/wire' },
		{ module: 'cola' }
	]
});
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

	marqueeView: {
		render: {
			template: { module: 'text!app/marquee/template.html' },
			replace: { module: 'i18n!app/marquee/strings' },
			// css: { module: 'css!app/marquee/structure.css' },
			at: { $ref: 'dom.first!.marquee', at: 'gameView' }
		}
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

	clientForClicksInvoker: {
		invoker: {
			method: 'clientFor', args: ['clicks']
		}
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

	clickStream: { create: 'app/game/clickStream' },

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
			'controller.selectDoor': 'setGameState'
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
		// { module: 'wire/debug' },
		{ module: 'wire/sizzle', classes: { init: 'loading' }},
		// { module: 'wire/dom', classes: { init: 'loading' }},
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'cola' }
	]
});
define({

	root: { $ref: 'dom!game' },

	controller: {
		create: 'app/controller',
		on: {
			doorsView: {
				'click:.door,.doorway': 'doors.findItem | selectDoor',
				'dblclick:.door,.doorway': 'doors.findItem | _openDoor'
			}
		},
		connect: {
			selectDoor: 'doors.update',
			_openDoor: 'doors.update'
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
				// TODO: data bindings
				status: { handler: { $ref: 'statusClassHandler' } },
				content: { selector: '.content', each: { $ref: 'contentClassHandler' } }

			},
			identifier: { $ref: 'selfLinkId' },
			comparator: { $ref: 'byId' }
		},
		insert: { at: 'root' }
	},

	doors: { create: 'cola/Hub' },

	doorsAdapter: {
		create: {
			module: 'cola/adapter/Array',
			args: [
				[
					{ links: [{ rel: 'self', href: 'http://foo.com/1' }], status: 'CLOSED', content: 'SMALL_FURRY_ANIMAL' },
					{ links: [{ rel: 'self', href: 'http://foo.com/2' }], status: 'CLOSED', content: 'JUERGEN' },
					{ links: [{ rel: 'self', href: 'http://foo.com/3' }], status: 'CLOSED', content: 'UNKNOWN' }
				],
				{
					identifier: { $ref: 'selfLinkId' },
					comparator: { $ref: 'byId' }
				}
			]
		},
		bind: { to: { $ref: 'doors' } }
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

	plugins: [
		{ module: 'wire/debug' },
		{ module: 'wire/dom', classes: { init: 'loading' }},
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/connect' },
		{ module: 'cola' }
	]
});
define({

	root: { $ref: 'dom!game' },

	doorsView: {
		render: {
			template: { module: 'text!app/doors/template.html' }
			// replace: { module: 'i18n!doors/strings' },
			// css: { module: 'css!doors/structure.css' }
		},
		bind: {
			to: { $ref: 'doors' },
			bindings: {
				// TODO: data bindings
				status: ''
			},
			identifier: { module: 'app/selfLinkIdentifier' }

		},
		insert: { at: 'root' }
	},

	doors: { create: 'cola/Hub' },

	doorsAdapter: {
		create: {
			module: 'cola/adapter/Array',
			args: [
				[
					{ links: [{ rel: 'self', href: 'http://foo.com/1' }], status: 'CLOSED' },
					{ links: [{ rel: 'self', href: 'http://foo.com/2' }], status: 'CLOSED' },
					{ links: [{ rel: 'self', href: 'http://foo.com/3' }], status: 'CLOSED' }
				],
				{ identifier: { module: 'app/selfLinkIdentifier' } }
			]
		},
		bind: {
			to: { $ref: 'doors' }
		}
	},

	plugins: [
		{ module: 'wire/debug' },
		{ module: 'wire/dom', classes: { init: 'loading' }},
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'cola' }
	]
});
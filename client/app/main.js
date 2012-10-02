define({

	root: { $ref: 'dom!game' },

	doorsView: {
		render: {
			template: { module: 'text!app/doors/template.html' }
			// replace: { module: 'i18n!doors/strings' },
			// css: { module: 'css!doors/structure.css' }
		},
		bind: {
			to: { $ref: 'doors' }
		},
		insert: { at: 'root' }
	},

	doors: { create: 'cola/Hub' },

	doorsAdapter: {
		literal: [],
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
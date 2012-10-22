define({

	/**
	 * This is an example of a simple "view component". It defines its
	 * own template, css styles, and i18n strings.  It has behavior, but
	 * the behavior is driven by OOCSS states, so no javascript is required.
	 * If it had any procedural logic or javascript-driven behavior,
	 * we would also include that here.
	 *
	 * @required $root {Element} a component which serves as the
	 * root node of the view.  The view will be rendered onto this node.
	 */
	$root: null,

	/*
		Render the view component using wire/dom/render onto
		the dom node that matches the css query ".instructions"
		under the 'gameView' node (our root).
	 */
	$exports: {
		render: {
			template: { module: 'text!app/instructions/template.html' },
			replace: { module: 'i18n!app/instructions/strings' },
			css: { module: 'css!app/instructions/structure.css' },
			at: { $ref: '$root' }
		}
	},

	/* Load the wire plugins we're using. */
	plugins: [
		{ module: 'wire/dom/render' }
	]
});
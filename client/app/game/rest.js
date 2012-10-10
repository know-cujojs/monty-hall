define({
	$exports: {
		create: 'app/game/restApi',
		properties: {
			gameClient: { $ref: 'gameClient' }
		}
	},

	baseClient: { $ref: 'client!', entity: false, mime: 'application/json' },

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
				{ entityParser: { $ref: 'entityParser' } }
			]
		}
	},

	plugins: [
		{ module: 'rest/wire' }
	]
});
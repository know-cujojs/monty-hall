define({
	$exports: {
		create: 'app/game/restApi',
		properties: {
			gameClient: { $ref: 'gameClient' }
		}
	},

	// FIXME: Change back to https://monty-hall.cloudfoundry.com/games onces
	// CORS is working
	baseClient: { $ref: 'client!/games', entity: false, mime: 'application/json' },

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
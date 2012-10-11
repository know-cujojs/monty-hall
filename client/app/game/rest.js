define({
	$exports: {
		create: 'app/game/restApi',
		properties: {
			gameClient: { $ref: 'gameClient' },
			host: 'https://monty-hall.cloudfoundry.com/games'
		}
	},

	baseClient: {
		create: {
			module: 'rest/interceptor/entity',
			args: {
				create: {
					module: 'rest/interceptor/location',
					args: { $ref: 'client!', mime: 'application/json', entity: false }
				}
			}
		}
	},

	gameClient: {
		create: {
			module: 'rest/interceptor/hateoas',
			args: [
				{ $ref: 'baseClient' },
				{
					target: '',
					client: { $ref: 'baseClient' }
				}
			]
		}
	},

	plugins: [
		{ module: 'rest/wire' }
	]
});
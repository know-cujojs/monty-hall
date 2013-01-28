// This wire spec exports the real game REST API which communicates with
// the monty hall server.
define({
	// Cretae and export an instance of the rest API, configured to point
	// to the correct host and to use a HATEOAS-aware rest implementation
	$exports: {
		create: 'app/game/restApi',
		properties: {
			gameClient: { $ref: 'gameClient' },
			host: 'https://monty-hall.cloudfoundry.com/games'
		}
	},

	// A HATEOAS-aware rest implementation that wraps the baseClient below
	gameClient: {
		create: {
			module: 'rest/interceptor/hateoas',
			args: [
				{ $ref: 'baseClient' },
				{ target: '' }
			]
		}
	},

	// Create a base rest client that understands how to parse JSON entities
	// out of the response body.  It also looks for Location headers after creating
	// new resources using POST, and automatically GETs the newly created
	// resource.
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

	// Include the rest package's wire plugin, which provides the
	// nice "client!" reference resolver for easily creating rest client
	// instances
	plugins: [
		{ module: 'rest/wire' }
	]
});
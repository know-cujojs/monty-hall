(function(define) {
define(function(require) {

	var when, doorData;

	when = require('when');

	doorData = [
		{'links':[{'rel':'self','href':'http://localhost:8080/monty-hall/games/2863629425905948275/doors/1'}],
			'status':'CLOSED','content':'UNKNOWN'},
		{'links':[{'rel':'self','href':'http://localhost:8080/monty-hall/games/2863629425905948275/doors/2'}],
			'status':'CLOSED','content':'UNKNOWN'},
		{'links':[{'rel':'self','href':'http://localhost:8080/monty-hall/games/2863629425905948275/doors/3'}],
			'status':'CLOSED','content':'UNKNOWN'}
	];

	return {
		createGame: createGame,
		getGame: function() {
			return this.game;
		},
		selectDoor: function(doorToSelect) {
			var self = this;

			doorToSelect.status = 'SELECTED';

			try {
				doorData.forEach(function(door) {
					if(door !== doorToSelect) {
						throw door;
					}
				});
			} catch(door) {
				door.content = 'SMALL_FURRY_ANIMAL';
				door.status = 'OPENED';
			}

			return when.resolve(doorToSelect);
		},
		openDoor: function(doorToOpen) {
			doorToOpen.status = 'OPENED';

			if(Math.random() <= 0.333) {
				doorToOpen.content = 'SMALL_FURRY_ANIMAL';
				this.game.status = 'LOST';
			} else {
				doorToOpen.content = 'JUERGEN';
				this.game.status = 'WON';
			}

			return when.resolve(doorToOpen);
		}
	};

	function createGame() {
		var game;

		this.game = game = {
			status: 'AWAITING_INITIAL_SELECTION',
			selfLink: {
				href: 'http://localhost:8080/monty-hall/games/2863629425905948275',
				rel: 'self'
			},
			doors: when.resolve({
				self: when.resolve(this),
				selfLink: {
					href: 'http://localhost:8080/monty-hall/games/2863629425905948275/doors',
					rel: 'self'
				},
				'doors': doorData
			}),
			doorsLink: {
				href: 'http://localhost:8080/monty-hall/games/2863629425905948275/doors',
				rel: 'doors'
			},
			history: when.resolve({}),
			historyLink: {
				href: 'http://localhost:8080/monty-hall/games/2863629425905948275/history',
				rel: 'history'
			},
			clientFor: function (rel) {
				return function (request) {
					return when.resolve({
						request: request
					});
				}
			}
		};

		game.self = when.resolve(game);

		return when.resolve(game);
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
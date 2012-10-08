(function(define) {
define(function(require) {

	var when, doorData;

	when = require('when');

	doorData = [
		{"links":[{"rel":"self","href":"http://localhost:8080/monty-hall/games/2863629425905948275/doors/1"}],
			"status":"CLOSED","content":"UNKNOWN"},
		{"links":[{"rel":"self","href":"http://localhost:8080/monty-hall/games/2863629425905948275/doors/2"}],
			"status":"CLOSED","content":"UNKNOWN"},
		{"links":[{"rel":"self","href":"http://localhost:8080/monty-hall/games/2863629425905948275/doors/3"}],
			"status":"CLOSED","content":"UNKNOWN"}
	];

	return {
		createGame: getGame,
		getGame: getGame,
		selectDoor: function(doorToSelect) {
			var self = this;

			doorToSelect.status = "SELECTED";

			try {
				doorData.forEach(function(door) {
					if(door !== doorToSelect) {
						throw door;
					}
				});
			} catch(door) {
				door.content = "SMALL_FURRY_ANIMAL";
				door.status = 'OPENED';
			}

			return when.resolve(doorToSelect);
		},
		openDoor: function(doorToOpen) {
			doorToOpen.status = 'OPENED';
			return when.resolve(doorToOpen);
		}
	};

	function getGame() {
		var doors, game;

		doors = {
			href: 'http://localhost:8080/monty-hall/games/2863629425905948275/doors',
			get: function() {
				return when.resolve({
					"links": [
						{"rel":"self","href":"http://localhost:8080/monty-hall/games/2863629425905948275/doors"}
					],
					"doors": doorData
				});
			},
			update: function(door) {
				return when.resolve(door);
			}
		};

		this.game = game = {
			status: 'AWAITING_INITIAL_SELECTION',
			self: {
				href: 'http://localhost:8080/monty-hall/games/2863629425905948275',
				get: function() {
					return when.resolve(game);
				}
			},
			doors: doors,
			history: {
				href: 'http://localhost:8080/monty-hall/games/2863629425905948275/history',
				get: function() {
					// TODO: Fill in fake history if we need it
					return when.resolve({});
				}
			}
		};

		return when.resolve(game);
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
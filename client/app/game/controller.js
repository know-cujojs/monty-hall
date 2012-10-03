(function (define) {
define(function (require) {

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

		selectDoor: function (door) {
			var result = this._doSelectDoor(door);

			if(this._doSelectDoor !== this._switchOrStay) {
				this._doSelectDoor = this._switchOrStay;
			} else {
				// TODO: Transition to final state
				this._doSelectDoor = noop;
			}

			return result;
		},

		_doSelectDoor: function(door) {
			return this._selectInitialDoor(door);
		},

		_selectInitialDoor: function(door) {
			return this._selectDoor(door).then(function(selectedDoor) {
				// this._getDoors().then(console.log.bind(console));
				this._getDoors().then(this._updateDoorsData.bind(this));
				return door;
			}.bind(this));
		},

		_switchOrStay: function(door) {
			if(door.status == 'OPENED') {
				return;
			}

			// TODO: Fake, remove this
			door.content = Math.random() >= 0.5 ? 'JUERGEN' : 'SMALL_FURRY_ANIMAL';

			return this._openDoor(door).then(function(openedDoor) {
				this._getDoors().then(this._updateDoorsData.bind(this));
				return door;
			}.bind(this));
		},

		_openDoor: function (door) {
			door.status = 'OPENED';
			return when.resolve(door);
		},

		_startGame: function() {
			var self, doors;

			self = this;
			doors = this.doors;

			return this._createGame()
			.then(function(gameMeta) {
				// extract Location header
				var gameUrl = '';
				return self._getGame(gameUrl);
			}).then(function(game) {
				self.game = game;
				return self._getDoors();
			}).then(this._updateDoorsData.bind(this));
		},

		_createGame: function() {
			return when.resolve({
				headers: {
					Location: 'blah'
				}
			});
		},

		_getGame: function(url) {
			return when.resolve({
				"links": [
					{"rel":"self","href":"http://localhost:8080/monty-hall/games/2863629425905948275"},
					{"rel":"doors","href":"http://localhost:8080/monty-hall/games/2863629425905948275/doors"},
					{"rel":"history","href":"http://localhost:8080/monty-hall/games/2863629425905948275/history"}
				],
				"status":"AWAITING_INITIAL_SELECTION"
			});
		},

		_getDoors: function() {
			return when.resolve({
				"links": [
					{"rel":"self","href":"http://localhost:8080/monty-hall/games/2863629425905948275/doors"}
				],
				"doors": doorData
			});
		},

		_updateDoorsData: function(doorData) {
			console.log(doorData);
			doorData.doors.forEach(this.doors.update);
		},

		_selectDoor: function(selectedDoor) {
			selectedDoor.status = "SELECTED";

			try {
				this.doors.forEach(function(door) {
					if(door !== selectedDoor) {
						throw door;
					}
				});
			} catch(door) {
				door.content = "SMALL_FURRY_ANIMAL";
				door.status = 'OPENED';
			}

			return when.resolve(selectedDoor);
		}

	};

	function noop() {}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
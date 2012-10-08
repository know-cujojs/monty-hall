(function (define) {
define(function (require) {

	var when;

	when = require('when');

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

		getStatus: function () {
			return this.game && this.game.status;
		},

		_doSelectDoor: function(door) {
			return this._selectInitialDoor(door);
		},

		_selectInitialDoor: function(door) {
			return this.gameApi.selectDoor(door).then(function(selectedDoor) {
				// this._getDoors().then(console.log.bind(console));
				this.game.doors.get().then(this._updateDoorsData.bind(this));
				// TODO: this probably isn't the right place for this:
				this.game.status = 'AWAITING_FINAL_SELECTION';
				return door;
			}.bind(this));
		},

		_switchOrStay: function(door) {
			if(door.status == 'OPENED') {
				return;
			}

			// TODO: Fake, remove this
			if (Math.random() >= 0.5) {
				door.content = 'JUERGEN';
				this.game.status = 'WON';
			}
			else {
				door.content = 'SMALL_FURRY_ANIMAL';
				this.game.status = 'LOST';
			}

			return this.gameApi.openDoor(door).then(function(openedDoor) {
				this.game.doors.get().then(this._updateDoorsData.bind(this));
				return door;
			}.bind(this));
		},

		_startGame: function() {
			var self, doors;

			self = this;
			doors = this.doors;

			return this.gameApi.createGame()
			.then(function(game) {
				self.game = game;
				return game.doors.get();
			}).then(this._updateDoorsData.bind(this));
		},

		_updateDoorsData: function(doorData) {
			doorData.doors.forEach(this.doors.update);
			return doorData;
		},

	};

	function noop() {}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
(function(define) {
define(function(require) {

	var when = require('when');

	return {
		createGame: function() {
			return this.gameClient({ method: 'POST' })
				.then(function(game) {
					this.game = game;
					return game;
				}.bind(this)
			);
		},
		
		getGame: function() {
			return this.game ? this.game.self.get() : when.reject();
		},
		
		selectDoor: function(doorToSelect) {
			doorToSelect.status = 'SELECTED';
			return updateDoor(this.game, doorToSelect);
		},
		
		openDoor: function(doorToOpen) {
			doorToOpen.status = 'OPENED';
			return updateDoor(this.game, doorToOpen);
		}
	};

	function updateDoor(game, doorToUpdate) {
		var self = this;

		return game.doors.update(doorToUpdate)
			.then(function(door) {
				return game.self.get().then(function(game) {
					self.game = game;
					return door;
				});
			}
		);

	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
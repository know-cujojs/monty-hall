(function(define) {
define(function(require) {

	var when = require('when');

	return {
		createGame: function() {
			return this.gameClient({ path: this.host, method: 'POST' })
				.then(function(game) {
					this.game = game;
					return game;
				}.bind(this)
			);
		},
		
		getGame: function() {
			return this.game ? this.game.self : when.reject();
		},
		
		selectDoor: function(doorToSelect) {
			doorToSelect.status = 'SELECTED';
			return updateDoor.call(this, doorToSelect);
		},
		
		openDoor: function(doorToOpen) {
			doorToOpen.status = 'OPENED';
			return updateDoor.call(this, doorToOpen);
		}
	};

	function updateDoor(doorToUpdate) {
		var client = doorToUpdate.clientFor('self');
		return client({ method: 'PUT', entity: { status: doorToUpdate.status } }).then(function (door) {
			// refresh the game with server state
			this.game = this.game.self;
			return door;
		}.bind(this));
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
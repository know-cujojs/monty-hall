(function(define) {
define(function(require) {

	var when = require('when');

	/**
	 * Implementation of the client-side game API that communicates with the
	 * REST game server.
	 */
	return {
		/**
		 * Game client implementation that will perform the actual REST operations.
		 * Must be injected
		 * @required
		 * @type {Function}
		 */
		gameClient: null,

		/**
		 * Base host/url of the REST API server endpoint with which to communicate
		 * @required
		 * @type {String}
		 */
		host: null,

		/**
		 * Create a new game resource
		 * @return {Promise} promise for the new game
		 */
		createGame: function() {
			return this.gameClient({ path: this.host, method: 'POST' })
				.then(function(game) {
					this.game = game;
					return game;
				}.bind(this)
			);
		},

		/**
		 * Returns the current game.  If a game has not yet been created, returns
		 * a rejected promise.
		 * @return {Promise} promise for the current game, or rejected promise.
		 */
		getGame: function() {
			return this.game ? this.game.self : when.reject();
		},

		/**
		 * Sets the supplied door's status to selected, and PUTs the updated door
		 * @param  {Object} doorToSelect door to select
		 * @return {Promise} promise that fulfills with the updated door data if
		 * the PUT is successful, and rejects if it fails.
		 */
		selectDoor: function(doorToSelect) {
			doorToSelect.status = 'SELECTED';
			return updateDoor.call(this, doorToSelect);
		},

		/**
		 * Sets the supplied door's status to opened, and PUTs the updated door
		 * @param  {Object} doorToOpen door to open
		 * @return {Promise} promise that fulfills with the updated door data if
		 * the PUT is successful, and rejects if it fails.
		 */
		openDoor: function(doorToOpen) {
			doorToOpen.status = 'OPENED';
			return updateDoor.call(this, doorToOpen);
		}
	};

	/**
	 * Helper function to update a door by doing a PUT to the REST endpoint.
	 * @param  {Object} doorToUpdate door to update
	 * @return {Promise} promise that fulfills with the updated door data if
	 * the PUT is successful, and rejects if it fails.
	 */
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
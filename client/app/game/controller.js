(function (define) {
	define(function (require, exports, module) {

		var when;

		when = require('when');

		/**
		 * The controller object.  Although it is declared as a singleton object
		 * the IOC Container (wire.js) will beget new instances using Object.create().
		 * This is a very convenient way to define "constructor-less" objects.
		 * using wire.js
		 */
		module.exports = {

			/**
			 * The game API that manages the game and door state
			 * @required
			 */
			gameApi: null,

			/**
			 * Method to update a single door
			 * @required
			 * @type {Function}
			 * @param {Object} door Door to update
			 */
			_updateDoor: null,

			/**
			 * Selects a door on behalf of the player.  Takes the appropriate
			 * action based on the current state of the game.
			 * @param  {Object} door Door to select
			 * @return {Promise} promise for the updated state of the door
			 *  possibly as reported from the server
			 */
			selectDoor: function (door) {
				// Can't select already-opened doors
				if (door.status == 'OPENED') {
					return door;
				}

				// This method changes the internal state of the controller
				// so it can take appropriate action based on the current
				// state of the game.

				var result = this._doSelectDoor(door);

				if (this._doSelectDoor !== this._switchOrStay) {
					this._doSelectDoor = this._switchOrStay;
				} else {
					this._doSelectDoor = noop;
				}

				return result;
			},

			/**
			 * Gets the current game state
			 * @return {String} string constant representing the current game state
			 */
			getStatus: function () {
				return this.game && this.game.status;
			},

			/**
			 * Helper method that represents "do the right thing when a door is
			 * selected".  This method is overwritten (see selectDoor above) based
			 * on the current state of the game.
			 * @param  {Object} door Door to select
			 * @return {Promise} promise for the selected door, containing its updated  status
			 */
			_doSelectDoor: function (door) {
				return this._selectInitialDoor(door);
			},

			/**
			 * When the game is in its initial state, this method is called when the player
			 * makes his/her initial door selection.
			 * @param  {Object} door Door to be selected
			 * @return {Promise} promise for the selected door, containing its updates status
			 */
			_selectInitialDoor: function (door) {
				return this.gameApi.selectDoor(door).then(function (selectedDoor) {
					this.game.status = 'AWAITING_FINAL_SELECTION';

					return this.game.doors
						.then(this._updateDoors.bind(this))
						.then(function () {
							return selectedDoor;
						});
				}.bind(this));
			},

			/**
			 * When the game is in the state where the player must decide to switch
			 * or stay, this method is called when the user selects a door.
			 * @param  {Object} door Door to be selected
			 * @return {Promise} promise for the selected door, containing its updated status
			 */
			_switchOrStay: function (door) {
				if (door.status == 'OPENED') {
					return;
				}

				var self, game, updateDoors;

				self = this;
				game = this.game;
				updateDoors = this._updateDoors.bind(this);

				return this.gameApi.openDoor(door).then(function (openedDoor) {
					return game.doors
						.then(updateDoors)
						.then(function () {
							return game.self;
						})
						.then(function (game) {
							self.game = game;
							return openedDoor;
						});
				});
			},

			/**
			 * Starts a new game
			 * @return {Promise} promise for a newly created game
			 */
			_startGame: function () {
				var self;

				self = this;

				return this.gameApi.createGame()
					.then(function (game) {
						self.game = game;
						return game.doors;
					})
					.then(this._updateDoors.bind(this))
					.then(function () {
						return self.game;
					});
			},

			/**
			 * When new or updated door data has been received from the server,
			 * this method is invoked to update the view model, and thus reflect
			 * the data changes into the view.
			 * @param  {Object} doorData server response containing each door
			 * @param  {Array} doorData.doors Array of door data
			 */
			_updateDoors: function (doorData) {
				doorData.doors.forEach(this._updateDoor);
			}

		};

		/**
		 * Simple no-op function to help manage game state
		 */
		function noop() {}

	});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require, exports, module); }
));
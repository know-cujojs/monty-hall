(function (define) {
define(function (require) {

	return {

		selectDoor: function (door) {
			door.status = 'SELECTED';
			return door;
		},

		openDoor: function (door) {
			door.status = 'OPENED';
			return door;
		}

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
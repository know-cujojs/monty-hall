(function(define) {
define(function(require) {

	return {
		selectDoor: function(door) {
			// TODO: Implement for real

			// Just for fun
			door.status = door.status !== 'SELECTED' ? 'SELECTED' : 'CLOSED';
		},

		_openDoor: function(door) {
			// TODO: Implement for real
			door.status = 'OPENED';
		}
	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
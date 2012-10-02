(function(define) {
define(function(require) {

	return {
		selectDoor: function(door) {
			door.status = door.status === 'OPENED' ? 'CLOSED' : 'OPENED';
			this.doors.update(door);
		}
	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });
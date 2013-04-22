(function (define) {
define(function () {

	/**
	 * Returns a strategy function that fires a "total" event after
	 * an adapter syncs -- if that adapter doesn't implement a "total" event.
	 * @param [options] {Object} options.
	 * @return {Function} a network strategy function
	 *
	 * Two major assumptions:
	 * 1) The add/remove events happen *during* the sync event, not after.
	 *    If we queue a "total" event during "sync", the adds/removes will
	 *    happen before the queued event is processed.  If we introduce a
	 *    new sync strategy, this may break.
	 * 2) The "total" event only happens once for providers that don't
	 *    already support it.  This seems a fairly safe assumption.
	 */
	return function (options) {
		var isProvider;

		if (!options) options = {};

		isProvider = options.isProvider || defaultIsProvider;

		return function provideTotalIfMissing (source, dest, data, type, api) {

			// watch for "join" events to find providers that lack a
			// "total" method.  (don't wait for the "sync" events to start
			// tracking these providers since that could be too late)
			if ('join' == type && isProvider(source) && api.isAfter()) {
				// if the provider lacks a total method
				if (typeof source.total != 'function') {
					// TURD ALERT!
					source._providedTotal = 0;
				}
			}
			// watch for add/remove during sync
			else if (('add' == type || 'remove' == type) && api.isAfter()) {
				if ('_providedTotal' in source) {
					source._providedTotal += 'add' == type ? 1 : -1;
				}
			}
			// watch for "sync" in the "before" phase since "sync"s are
			// (currently) stopped from proceeding past that stage
			else if ('sync' == type && api.isBefore()) {
				if ('_providedTotal' in source) {
					// queue a total event
					api.queueEvent(source, source._providedTotal, 'total');
					// remove turd
					delete source._providedTotal
				}
			}

		};

	};

	function defaultIsProvider (adapter) {
		return adapter.provide;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));
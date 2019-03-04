class Control {

	constructor () {
		this._triggerResultsCache = {};
		this._loadResultsCache = {};
	}

	/**
	 * @param  {Object} options
	 * @param  {HTMLElement} options.element
	 * @param  {string} options.id
	 * @param  {boolean} [options.isEmpty]
	 *
	 * @return {Promise<boolean>}
	 */
	shouldTriggerControl () {
		return Promise.resolve(false);
	}

	/**
	 * @param  {Object} options
	 * @param  {HTMLElement} options.element
	 * @param  {string} options.id
	 * @param  {boolean} [options.isEmpty]
	 *
	 * @return {Promise<*>}
	 */
	afterZoneLoad () {
		return Promise.resolve();
	}

	/**
	 * @param  {Object} options
	 * @param  {HTMLElement} options.element
	 * @param  {string} options.id
	 * @param  {Promise} options.loadResult
	 * @param  {boolean} [options.isEmpty]
	 */
	onZoneShow () {

	}

	/**
	 * @param  {Object} options
	 * @param  {HTMLElement} options.element
	 * @param  {string} options.id
	 * @param  {Promise} options.loadResult
	 * @param  {boolean} [options.isEmpty]
	 */
	onZoneHide () {

	}

	/**
	 * @param  {Object} options
	 * @param  {HTMLElement} options.element
	 * @param  {string} options.id
	 * @param  {Promise} options.loadResult
	 * @param  {boolean} [options.isEmpty]
	 */
	destroy () {

	}

}

export default Control;

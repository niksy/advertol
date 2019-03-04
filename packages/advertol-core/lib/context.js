class Context {

	constructor () {
		this._resolveAll = () => {};
	}

	/**
	 * @param  {string[]} visibleZoneIds
	 */
	calculate () {}

	resolve () {
		this._resolveAll();
	}

	destroy () {}

}

export default Context;

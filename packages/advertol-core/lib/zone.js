class Zone {

	/**
	 * @param  {string} id
	 * @param  {HTMLElement} element
	 */
	constructor ( id, element ) {

		if ( typeof id !== 'string' ) {
			throw new TypeError('Expected a string.');
		}
		if ( (element instanceof HTMLElement) === false ) {
			throw new TypeError('Expected an element.');
		}

		this.id = id;
		this.element = element;
		this.isVisible = false;
		this.isLoaded = false;
		this.isEmpty = false;

	}

	show () {
		this.isVisible = true;
	}

	hide () {
		this.isVisible = false;
	}

	setAsLoaded () {
		this.isLoaded = true;
		this.isEmpty = false;
	}

	setAsEmpty () {
		this.isLoaded = true;
		this.isEmpty = true;
	}

	destroy () {
		this.isVisible = false;
	}

}

export default Zone;

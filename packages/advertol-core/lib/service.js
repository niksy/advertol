class Service {

	/**
	 * @param  {HTMLElement} element
	 * @param  {string} id
	 */
	afterZoneRegistered () {

	}

	/**
	 * @param  {Object[]} zones
	 * @param  {HTMLElement} zones[].element
	 * @param  {string} zones[].id
	 */
	beforeWriteZones () {

	}

	/**
	 * @param  {HTMLElement} element
	 * @param  {string} id
	 *
	 * @return {Promise<Boolean>}
	 */
	writeZone () {
		// If true, zone has content
		// If false, zone is empty
		return Promise.resolve(true);
	}

	/**
	 * @param  {Object[]} zones
	 * @param  {HTMLElement} zones[].element
	 * @param  {string} zones[].id
	 */
	afterWriteZones () {

	}

	destroy () {

	}

}

export default Service;

import Zone from './zone';
import { memoizePromise } from './util';

/**
 * @param  {String[]} zoneIds
 *
 * @return {Function}
 */
function filterById ( zoneIds ) {

	/**
	 * @param  {Zone} zone
	 *
	 * @return {boolean}
	 */
	return ({ id }) => zoneIds.indexOf(id) !== -1;
}

class Zones {

	/**
	 * @param  {Zone[]} zones
	 * @param  {ControlResolver} controlResolver
	 * @param  {Service} service
	 */
	constructor ( zones, controlResolver, service ) {

		this.instances = [];
		this.writeResults = {};
		this.controlResolver = controlResolver;
		this.service = service;

		zones.forEach(( zone ) => {
			this.add(zone);
		});

	}

	/**
	 * @param {Zone} zone
	 */
	add ( zone ) {

		if ( (zone instanceof Zone) === false ) {
			throw new TypeError('Expected zone instance.');
		}

		const { element, id } = zone;

		if ( this.instances.some(({ id: existingId }) => existingId === id) === true ) {
			return;
		}

		this.instances.push(zone);
		this.service.afterZoneRegistered({ element, id });

	}

	/**
	 * @param  {string[]} zoneIds
	 *
	 * @return {Promise<Zone[]>}
	 */
	show ( zoneIds ) {

		const boundFilterById = filterById(zoneIds);
		const zones = this.instances.filter(boundFilterById);

		const zonePromises = zones
			.filter(({ isLoaded }) => isLoaded === true)
			.map(( zone ) => {
				const { isVisible: isInitiallyVisible } = zone;
				zone.show();
				if ( isInitiallyVisible ) {
					return Promise.resolve(zone);
				}
				return this.controlResolver.resolve(zone).then(() => zone);
			});

		return Promise.all(zonePromises);

	}

	/**
	 * @param  {string[]} zoneIds
	 *
	 * @return {Promise<Zone[]>}
	 */
	hide ( zoneIds ) {

		const boundFilterById = filterById(zoneIds);
		const zones = this.instances.filter(boundFilterById);

		const zonePromises = zones
			.filter(({ isLoaded }) => isLoaded === true)
			.map(( zone ) => {
				const { isVisible: isInitiallyVisible } = zone;
				zone.hide();
				if ( !isInitiallyVisible ) {
					return Promise.resolve(zone);
				}
				return this.controlResolver.resolve(zone).then(() => zone);
			});

		return Promise.all(zonePromises);

	}

	/**
	 * @param  {string[]} zoneIds
	 *
	 * @return {Promise<Zone[]>}
	 */
	write ( zoneIds ) {

		const boundFilterById = filterById(zoneIds);
		const zones = this.instances
			.filter(boundFilterById)
			.filter(({ isLoaded }) => isLoaded === false);

		const serviceProps = zones.map(({ element, id }) => ({
			element,
			id
		}));

		this.service.beforeWriteZones(serviceProps);

		const writePromises = zones.map(( zone ) => {

			const { element, id } = zone;

			const writePromise = memoizePromise({
				key: id,
				cache: this.writeResults,
				result: () => this.service.writeZone({ element, id })
			});

			const writePromiseResult = writePromise
				.then(( hasContent ) => {

					const isEmpty = !hasContent;

					if ( isEmpty ) {
						zone.setAsEmpty();
					} else {
						zone.setAsLoaded();
					}
					const { isVisible: isInitiallyVisible } = zone;
					zone.show();
					if ( isInitiallyVisible ) {
						return Promise.resolve(zone);
					}
					return this.controlResolver.resolve(zone).then(() => zone);

				});

			return writePromiseResult;

		});

		this.service.afterWriteZones(serviceProps);

		return Promise.all(writePromises);

	}

	destroy () {
		this.instances.forEach(( zone ) => {
			zone.destroy();
		});
		this.instances = [];
	}

}

export default Zones;

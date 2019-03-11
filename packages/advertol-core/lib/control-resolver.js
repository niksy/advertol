import Control from './control';
import Zones from './zones';
import { memoizePromise } from './util';

class ControlResolver {

	/**
	 * @param  {Control[]}  controls
	 */
	constructor ( controls = [] ) {

		this.zones = [];
		this.controls = [];

		controls.forEach(( control ) => {
			this.addControl(control);
		});

	}

	/**
	 * @param {Control} control
	 */
	addControl ( control ) {
		if ( (control instanceof Control) === false ) {
			throw new TypeError('Expected control instance.');
		}
		this.controls.push(control);
	}

	/**
	 * @param  {Zone} zone
	 *
	 * @return {Promise<Control[]>}
	 */
	resolve ( zone ) {

		const { element, id, isLoaded, isEmpty, isVisible: isInitiallyVisible } = zone;

		if ( this.zones.some(({ id: existingId }) => existingId === id) === false ) {
			this.zones.push(zone);
		}

		const controlPromises = this.controls.map(( control ) => {

			const triggerPromise = memoizePromise({
				key: id,
				cache: control._shouldTriggerControlCache,
				result: () => control.shouldTriggerControl({ isEmpty, element, id })
			});

			return triggerPromise
				.then(( isControlTriggered ) => {

					if ( !isLoaded ) {
						return Promise.reject({ reason: 'ZoneNotLoaded' });
					}

					if ( !isControlTriggered ) {
						return Promise.reject({ reason: 'UntriggeredControl' });
					}

					const loadPromise = memoizePromise({
						key: id,
						cache: control._onInitialControlTriggerCache,
						result: () => control.onInitialControlTrigger({ isEmpty, element, id })
					});

					return loadPromise;

				})
				.then(( initialControlTriggerResult ) => {

					const { isVisible } = zone;

					if ( isInitiallyVisible && isVisible ) {
						control.onZoneShow({ isEmpty, element, id, initialControlTriggerResult });
					}

					if ( !isInitiallyVisible && !isVisible ) {
						control.onZoneHide({ isEmpty, element, id, initialControlTriggerResult });
					}

					return control;

				})
				.catch(( error ) => {

					if (
						typeof error === 'object' &&
						(error.reason === 'UntriggeredControl' || error.reason === 'ZoneNotLoaded')
					) {
						return control;
					}
					throw error;

				});

		});

		return Promise.all(controlPromises);

	}

	destroy () {

		this.controls.forEach(( control ) => {

			const onInitialControlTriggerCache = control._onInitialControlTriggerCache;

			this.zones.forEach(({ element, id, isEmpty }) => {

				const initialControlTriggerResult = onInitialControlTriggerCache[id] || Promise.resolve();

				control.destroy({ isEmpty, element, id, initialControlTriggerResult });

			});

		});

		this.zones = [];
		this.controls = [];

	}

}

export default ControlResolver;

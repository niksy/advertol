import { Context } from '@advertol/core';
import intersection from 'mout/array/intersection';
import difference from 'mout/array/difference';

class MediaQueryContext extends Context {

	/**
	 * @param  {Object} contexts
	 */
	constructor ( contexts ) {
		super();
		this.contexts = this.setupContexts(contexts);
		this.listen();
	}

	/**
	 * @param  {Object} contexts
	 *
	 * @return {Object}
	 */
	setupContexts ( contexts ) {

		return Object.entries(contexts)
			.reduce(( contexts, [ mediaQuery, zones ]) => {
				return {
					...contexts,
					[mediaQuery]: {
						mediaQuery: window.matchMedia(mediaQuery),
						zones: zones,
						listener: null
					}
				};
			}, {});

	}

	listen () {

		Object.values(this.contexts)
			.forEach(( context ) => {

				context.listener = ( mediaQuery ) => {
					if ( mediaQuery.matches || this.isAnyContextActive() === false ) {
						this.resolve();
					}
				};

				context.mediaQuery.addListener(context.listener);

			});

	}

	unlisten () {

		Object.values(this.contexts)
			.forEach(( context ) => {
				context.mediaQuery.removeListener(context.listener);
			});

	};

	/**
	 * @return {boolean}
	 */
	isAnyContextActive () {

		return Object.values(this.contexts)
			.some(( context ) => context.mediaQuery.matches);

	}

	/**
	 * @param  {string[]} zonesList
	 */
	calculate ( zonesList ) {

		const visibleZones = intersection(this.getVisibleZones(), zonesList);
		const hiddenZones = difference(zonesList, visibleZones);

		return {
			hidden: hiddenZones,
			visible: visibleZones
		};

	}

	/**
	 * @return {string[]}
	 */
	getVisibleZones () {

		return Object.values(this.contexts)
			.reduce(( zones, context) => {
				if ( context.mediaQuery.matches ) {
					return [...zones, ...context.zones];
				}
				return zones;
			}, []);

	}

	destroy () {
		this.unlisten();
		this.contexts = {};
	}

}

export default MediaQueryContext;

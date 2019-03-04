import Zone from './lib/zone';
import Zones from './lib/zones';
import ControlResolver from './lib/control-resolver';
import ContextResolver from './lib/context-resolver';
import Control from './lib/control';
import Context from './lib/context';
import Service from './lib/service';

class Advertol {

	/**
	 * @param  {Object} options
	 * @param  {Object[]} options.zones
	 * @param  {Service} options.service
	 * @param  {Control[]} options.control
	 * @param  {Context[]} options.context
	 */
	constructor ( options = {} ) {

		const {
			zones = [],
			service = null,
			control = [],
			context = []
		} = options;

		if ( (service instanceof Service) === false ) {
			throw new TypeError('Expected a service.');
		}

		const zonesInstances = zones.map(({ element, id }) => new Zone(id, element));

		this.service = service;
		this.controlResolver = new ControlResolver(control);
		this.zones = new Zones(zonesInstances, this.controlResolver, this.service);
		this.contextResolver = new ContextResolver(this.zones, context);

	}

	/**
	 * @return {Promise}
	 */
	resolve () {
		return this.contextResolver.resolve().then(() => undefined); // eslint-disable-line no-undefined
	}

	/**
	 * @param  {Control} control
	 */
	addControl ( control ) {
		this.controlResolver.addControl(control);
	}

	/**
	 * @param  {Context} context
	 */
	addContext ( context ) {
		this.contextResolver.addContext(context);
	}

	/**
	 * @param {Object} zone
	 * @param {HTMLElement} zone.element
	 * @param {string} zone.id
	 */
	addZone ({ element, id }) {
		this.zones.add(new Zone(id, element));
	}

	destroy () {
		this.service.destroy();
		this.controlResolver.destroy();
		this.contextResolver.destroy();
		this.zones.destroy();
	}

}

/**
 * @param  {Object} options
 *
 * @return {Object}
 */
export default ( options = {} ) => {

	const instance = new Advertol(options);

	return [
		'resolve',
		'addControl',
		'addContext',
		'addZone',
		'destroy'
	].reduce(( obj, method ) => ({
		...obj,
		[method]: instance[method].bind(instance)
	}), {});

};

export {
	Control,
	Context,
	Service
};

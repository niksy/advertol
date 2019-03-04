import Context from './context';
import Zones from './zones';

class ContextResolver {

	/**
	 * @param  {Zones} zones
	 * @param  {Context[]}  contexts
	 */
	constructor ( zones, contexts = [] ) {

		if ( (zones instanceof Zones) === false ) {
			throw new TypeError('Expected zones instance.');
		}

		this.zones = zones;
		this.contexts = [];

		contexts.forEach(( context ) => {
			this.addContext(context);
		});

	}

	/**
	 * @param {Context} context
	 */
	addContext ( context ) {
		if ( (context instanceof Context) === false ) {
			throw new TypeError('Expected context instance.');
		}
		context._resolveAll = () => {
			this.resolve();
		};
		this.contexts.push(context);
	}

	/**
	 * @return {Promise<Array[]>}
	 */
	resolve () {

		if ( (this.zones instanceof Zones) === false ) {
			return Promise.resolve();
		}

		const zoneIds = this.zones.instances.map(({ id }) => id);

		const {
			hidden,
			visible
		} = this.contexts
			.reduce(({ hidden: previouslyHidden, visible: previouslyVisible }, context ) => {
				const {
					visible: nextVisible,
					hidden: nextHidden
				} = context.calculate(previouslyVisible);
				return {
					visible: nextVisible,
					hidden: [...previouslyHidden, ...nextHidden]
				};
			}, {
				hidden: [],
				visible: zoneIds
			});

		return Promise.all([
			this.zones.hide(hidden),
			this.zones.show(visible),
			this.zones.write(visible)
		]);

	}

	destroy () {

		this.contexts.forEach(( context ) => {
			context.destroy();
		});

		this.zones = null;
		this.contexts = [];

	}

}

export default ContextResolver;

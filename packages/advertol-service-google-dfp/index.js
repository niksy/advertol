import { Service } from '@advertol/core';

class GoogleDfpService extends Service {

	constructor ( options = {} ) {
		super();

		this.filledZoneCallbacks = {};
		this.emptyZoneCallbacks = {};
		this.resolvedSlots = {};

		this.slotResolvedZones = [];
		this.refreshedZones = [];
		this.displayedZones = [];

		const {
			slots = {},
			onSetup = () => {},
			refreshZones = this.refreshZones
		} = options;

		this.refreshZones = refreshZones.bind(this);
		this.slots = slots;

		/* istanbul ignore next */
		this.cmd(() => {
			this.setupService();
			onSetup.call(this);
			this.setupEvents();
		});

	}

	/**
	 * @param  {Function} callback [description]
	 */
	cmd /* istanbul ignore next */ ( callback ) {

		if ( typeof window.googletag === 'undefined' ) {
			return;
		}

		window.googletag.cmd.push(callback);

	}

	setupService /* istanbul ignore next */ () {

		if ( typeof window.googletag === 'undefined' ) {
			return;
		}

		window.googletag.pubads().enableSingleRequest();
		window.googletag.pubads().collapseEmptyDivs(true);
		window.googletag.pubads().disableInitialLoad();

		window.googletag.enableServices();

	}

	setupEvents /* istanbul ignore next */ () {

		if ( typeof window.googletag === 'undefined' ) {
			return;
		}

		window.googletag.pubads().addEventListener('slotRenderEnded', ( data ) => {

			const zoneName = data.slot.getAdUnitPath();
			const zoneResponse = data.slot.getResponseInformation();

			const callback =
				this.isZoneEmpty(zoneResponse) ?
					this.emptyZoneCallbacks[zoneName] :
					this.filledZoneCallbacks[zoneName];

			if ( typeof callback === 'function' ) {
				callback();
			}

			delete this.filledZoneCallbacks[zoneName];
			delete this.emptyZoneCallbacks[zoneName];

		});

	}

	/**
	 * @param  {HTMLElement} zone.element
	 * @param  {string} zone.id
	 */
	displayZone /* istanbul ignore next */ ({ element, id }) {

		if ( typeof window.googletag === 'undefined' ) {
			return;
		}

		window.googletag.display(element.id);

	}

	/**
	 * @param  {googletag.Slot[]} slots
	 */
	refreshZones /* istanbul ignore next */ ( slots ) {

		if ( typeof window.googletag === 'undefined' ) {
			return;
		}

		window.googletag.pubads().refresh(slots);

	}

	/**
	 * @param  {Object[]} zones
	 */
	beforeWriteZones ( zones ) {

		this.cmd(() => {

			if ( zones.length === 0 ) {
				return;
			}

			zones
				.filter(({ id }) => this.slotResolvedZones.indexOf(id) === -1 && (id in this.slots) === true)
				.forEach(({ id }) => {
					this.slotResolvedZones.push(id);
					this.resolvedSlots[id] = this.slots[id]();
				});

		});

	}

	/**
	 * @param  {Object[]} zones
	 */
	afterWriteZones ( zones ) {

		this.cmd(() => {

			if ( zones.length === 0 ) {
				return;
			}

			const slots = zones
				.filter(({ id }) => this.refreshedZones.indexOf(id) === -1 && (id in this.slots) === true)
				.map(({ id }) => {
					this.refreshedZones.push(id);
					return this.resolvedSlots[id];
				});

			if ( slots.length === 0 ) {
				return;
			}

			this.refreshZones(slots);

		});

	}

	/**
	 * @param  {HTMLElement} zone.element
	 * @param  {string} zone.id
	 *
	 * @return {Promise<boolean>}
	 */
	writeZone ({ element, id }) {

		return new Promise(( resolve ) => {

			this.filledZoneCallbacks[id] = () => resolve(true);
			this.emptyZoneCallbacks[id] = () => resolve(false);

			this.cmd(() => {

				if ( this.displayedZones.indexOf(id) === -1 && (id in this.slots) === true ) {
					this.displayedZones.push(id);
					this.displayZone({ element, id });
				}

			});

		});

	}

	/**
	 * @param  {*}  response
	 *
	 * @return {boolean}
	 */
	isZoneEmpty ( response ) {
		return response === null;
	}

}

export default GoogleDfpService;

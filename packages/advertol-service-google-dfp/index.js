import { Service } from '@advertol/core';

class GoogleDfpService extends Service {

	constructor ( options = {} ) {
		super();

		this.slots = {};
		this.adUnitPaths = {};
		this.filledZoneCallbacks = {};
		this.emptyZoneCallbacks = {};
		this.resolvedSlots = {};

		this.slotResolvedZones = [];
		this.refreshedZones = [];
		this.displayedZones = [];

		const {
			zones = [],
			onSetup = () => {},
			refreshZones = this.refreshZones
		} = options;

		this.refreshZones = refreshZones.bind(this);

		zones.forEach(({ id, adUnitPath, slot }) => {
			this.addZone({ id, adUnitPath, slot });
		});

		/* istanbul ignore next */
		this.cmd(() => {
			this.setupService();
			onSetup.call(this);
			this.setupEvents();
		});

	}

	/**
	 * @param {string}   id
	 * @param {string}   adUnitPath
	 * @param {Function} callback
	 */
	addZone ({ id, adUnitPath, slot }) {
		if ( id in this.slots && id in this.adUnitPaths ) {
			return;
		}
		this.slots[id] = slot;
		this.adUnitPaths[id] = adUnitPath;
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

			const adUnitPath = data.slot.getAdUnitPath();
			const response = data.slot.getResponseInformation();

			const callback =
				this.isZoneEmpty(response) ?
					this.emptyZoneCallbacks[adUnitPath] :
					this.filledZoneCallbacks[adUnitPath];

			if ( typeof callback === 'function' ) {
				callback();
			}

			delete this.filledZoneCallbacks[adUnitPath];
			delete this.emptyZoneCallbacks[adUnitPath];

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

			const adUnitPath = this.adUnitPaths[id];
			this.filledZoneCallbacks[adUnitPath] = () => resolve(true);
			this.emptyZoneCallbacks[adUnitPath] = () => resolve(false);

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

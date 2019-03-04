import assert from 'assert';
import Zone from '../lib/zone';
import Zones from '../lib/zones';
import ControlResolver from '../lib/control-resolver';
import Service from '../lib/service';

function setup ( options = {} ) {

	const {
		service = new Service()
	} = options;

	const id = 'becky';
	const element = document.querySelector('.Zone--bec');
	const controlResolver = new ControlResolver();
	const zones = new Zones([
		new Zone('becky', document.querySelector('.Zone--becky')),
		new Zone('rufus', document.querySelector('.Zone--rufus')),
		new Zone('loki', document.querySelector('.Zone--loki'))
	], controlResolver, service);

	return {
		element,
		id,
		zones,
		teardown: () => {
			service.destroy();
			controlResolver.destroy();
			zones.destroy();
		}
	};

}

function getVisibleZones ( zones ) {
	return zones.instances.filter(({ isVisible }) => isVisible);
}

function getHiddenZones ( zones ) {
	return zones.instances.filter(({ isVisible }) => !isVisible);
}

before(function () {
	window.fixture.load('/test/fixtures/index.html');

});

after(function () {
	window.fixture.cleanup();
});

describe('Zones', function () {

	it('should create instance', function () {

		const {
			zones,
			teardown
		} = setup();

		assert.equal(zones.instances.length, 3);

		teardown();

	});

	it('should show zones', function () {

		const {
			zones,
			teardown
		} = setup();

		zones.show(['becky']);

		assert.equal(getVisibleZones(zones).length, 0);
		assert.equal(getHiddenZones(zones).length, 3);

		teardown();

	});

	it('should hide zones', function () {

		const {
			zones,
			teardown
		} = setup();

		zones.hide(['becky']);

		assert.equal(getVisibleZones(zones).length, 0);
		assert.equal(getHiddenZones(zones).length, 3);

		teardown();

	});

	it('should handle already visible zones', function () {

		const {
			zones,
			teardown
		} = setup();

		const becky = zones.instances.find(({ id }) => id === 'becky');

		becky.setAsLoaded();

		zones.show(['becky']);

		assert.equal(getVisibleZones(zones).length, 1);
		assert.equal(getHiddenZones(zones).length, 2);

		teardown();

	});

	it('should handle already hidden zones', function () {

		const {
			zones,
			teardown
		} = setup();

		const becky = zones.instances.find(({ id }) => id === 'becky');

		becky.setAsLoaded();

		zones.hide(['becky']);

		assert.equal(getVisibleZones(zones).length, 0);
		assert.equal(getHiddenZones(zones).length, 3);

		teardown();

	});

	it('should show zones when one instance has empty content', function () {

		const {
			zones,
			teardown
		} = setup();

		const becky = zones.instances.find(({ id }) => id === 'becky');

		becky.setAsEmpty();

		zones.show(['becky']);

		assert.equal(getVisibleZones(zones).length, 1);
		assert.equal(getHiddenZones(zones).length, 2);

		teardown();

	});

	it('should discard duplicate zones', function () {

		const {
			zones,
			teardown
		} = setup();

		zones.add(new Zone('becky', document.querySelector('.Zone--becky')));

		assert.equal(zones.instances.length, 3);

		teardown();

	});

	it('should write zones', async function () {

		class DummyService extends Service {
			async writeZone ({ id }) {
				if ( id === 'rufus' ) {
					return false;
				}
				return true;
			}
		}

		const {
			zones,
			teardown
		} = setup({
			service: new DummyService()
		});

		await zones.write(['becky', 'loki']);
		await zones.write(['rufus']);

		const [ becky, rufus, loki ] = zones.instances;

		assert.equal(getVisibleZones(zones).length, 3);
		assert.equal(getHiddenZones(zones).length, 0);

		assert.equal(becky.isLoaded, true);
		assert.equal(becky.isVisible, true);
		assert.equal(becky.isEmpty, false);

		assert.equal(loki.isLoaded, true);
		assert.equal(loki.isVisible, true);
		assert.equal(loki.isEmpty, false);

		assert.equal(rufus.isLoaded, true);
		assert.equal(rufus.isVisible, true);
		assert.equal(rufus.isEmpty, true);

	});

	it('should destroy instance', function () {

		const {
			zones,
			teardown
		} = setup();

		zones.destroy();

		assert.equal(zones.instances.length, 0);

		teardown();

	});

});

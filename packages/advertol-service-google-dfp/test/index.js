import assert from 'assert';
import sinon from 'sinon';
import Service from '../index';

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

it('should properly implement service', async function () {

	const zones = [{
		id: 'becky',
		element: document.querySelector('.becky')
	}];

	const adUnits = [{
		id: 'becky',
		adUnitPath: '/42/becky',
		slot: () => 'becky'
	}];

	const service = new Service({ zones: adUnits });

	sinon.stub(service, 'cmd').callsFake(( callback ) => callback());
	sinon.stub(service, 'setupService').callsFake(() => {});
	sinon.stub(service, 'setupEvents').callsFake(() => {});
	sinon.stub(service, 'displayZone').callsFake(({ id }) => {
		const adUnitPath = service.adUnitPaths[id];
		service.filledZoneCallbacks[adUnitPath]();
	});
	sinon.stub(service, 'refreshZones').callsFake(() => {});

	service.beforeWriteZones(zones);
	await service.writeZone(zones[0]);
	service.afterWriteZones(zones);

	assert.deepEqual(service.slotResolvedZones, ['becky']);
	assert.deepEqual(service.refreshedZones, ['becky']);
	assert.deepEqual(service.displayedZones, ['becky']);

});

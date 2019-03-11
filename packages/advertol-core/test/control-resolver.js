import assert from 'assert';
import sinon from 'sinon';
import Zone from '../lib/zone';
import Zones from '../lib/zones';
import Service from '../lib/service';
import Control from '../lib/control';
import ControlResolver from '../lib/control-resolver';
import { setTimeoutAsPromise } from './util';

function setup ( options = {} ) {

	const {
		shouldTriggerControl = false,
		triggerTimeout = 0
	} = options;

	const shouldTriggerControlSpy = sinon.spy();
	const onInitialControlTriggerSpy = sinon.spy();
	const onZoneShowSpy = sinon.spy();
	const onZoneHideSpy = sinon.spy();
	const destroySpy = sinon.spy();
	const id = 'becky';
	const element = document.querySelector('.Zone');

	class DummyControl extends Control {
		async shouldTriggerControl (...args) {
			if ( triggerTimeout !== 0 ) {
				await setTimeoutAsPromise(triggerTimeout);
			}
			shouldTriggerControlSpy(...args);
			return shouldTriggerControl;
		}
		async onInitialControlTrigger (...args) {
			onInitialControlTriggerSpy(...args);
			return {};
		}
		onZoneShow ( ...args ) {
			onZoneShowSpy(...args);
		}
		onZoneHide ( ...args ) {
			onZoneHideSpy(...args);
		}
		destroy ( ...args ) {
			destroySpy(...args);
		}
	}

	const service = new Service();
	const zone = new Zone(id, element, service);
	const control = new DummyControl();
	const controlResolver = new ControlResolver([control]);
	const zones = new Zones([zone], controlResolver, service);

	return {
		element,
		id,
		zone,
		zones,
		controlResolver,
		shouldTriggerControlSpy,
		onInitialControlTriggerSpy,
		onZoneShowSpy,
		onZoneHideSpy,
		destroySpy,
		teardown: () => {
			service.destroy();
			zone.destroy();
			control.destroy();
			controlResolver.destroy();
			zones.destroy();
		}
	};

}

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

describe('ControlResolver', function () {

	it('should cache `shouldTriggerControl` calls', async function () {

		const {
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			teardown
		} = setup({ shouldTriggerControl: false });

		zone.show();

		await Promise.all([
			controlResolver.resolve(zone),
			controlResolver.resolve(zone),
			controlResolver.resolve(zone)
		]);

		assert.equal(shouldTriggerControlSpy.callCount, 1);

		teardown();

	});

	it('should cache `onInitialControlTrigger` calls', async function () {

		const {
			zone,
			controlResolver,
			onInitialControlTriggerSpy,
			teardown
		} = setup({ shouldTriggerControl: true });

		zone.show();

		await Promise.all([
			controlResolver.resolve(zone),
			controlResolver.resolve(zone),
			controlResolver.resolve(zone)
		]);

		assert.equal(onInitialControlTriggerSpy.callCount, 0);

		zone.setAsLoaded();

		await Promise.all([
			controlResolver.resolve(zone),
			controlResolver.resolve(zone),
			controlResolver.resolve(zone)
		]);

		assert.equal(onInitialControlTriggerSpy.callCount, 1);

		teardown();

	});

	it('should handle case: zone not loaded, should show zone, should not trigger control', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: false });

		zone.show();

		await controlResolver.resolve(zone);

		assert.equal(shouldTriggerControlSpy.callCount, 1);
		assert.equal(onInitialControlTriggerSpy.callCount, 0);
		assert.equal(onZoneShowSpy.callCount, 0);
		assert.equal(onZoneHideSpy.callCount, 0);
		assert.deepEqual(shouldTriggerControlSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.equal(zone.isLoaded, false);
		assert.equal(zone.isVisible, true);

		teardown();

	});

	it('should handle case: zone not loaded, should hide zone, should not trigger control', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: false });

		zone.hide();

		await controlResolver.resolve(zone);

		assert.equal(shouldTriggerControlSpy.callCount, 1);
		assert.equal(onInitialControlTriggerSpy.callCount, 0);
		assert.equal(onZoneShowSpy.callCount, 0);
		assert.equal(onZoneHideSpy.callCount, 0);
		assert.deepEqual(shouldTriggerControlSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.equal(zone.isLoaded, false);
		assert.equal(zone.isVisible, false);

		teardown();

	});

	it('should handle case: zone loaded, should show zone, should trigger control', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: true });

		zone.show();
		zone.setAsLoaded();

		await controlResolver.resolve(zone);

		assert.equal(shouldTriggerControlSpy.callCount, 1);
		assert.equal(onInitialControlTriggerSpy.callCount, 1);
		assert.equal(onZoneShowSpy.callCount, 1);
		assert.equal(onZoneHideSpy.callCount, 0);
		assert.deepEqual(shouldTriggerControlSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.deepEqual(onInitialControlTriggerSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.equal(zone.isLoaded, true);
		assert.equal(zone.isVisible, true);

		teardown();

	});

	it('should handle case: zone loaded, should hide zone, should trigger control', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: true });

		zone.hide();
		zone.setAsLoaded();

		await controlResolver.resolve(zone);

		assert.equal(shouldTriggerControlSpy.callCount, 1);
		assert.equal(onInitialControlTriggerSpy.callCount, 1);
		assert.equal(onZoneShowSpy.callCount, 0);
		assert.equal(onZoneHideSpy.callCount, 1);
		assert.deepEqual(shouldTriggerControlSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.deepEqual(onInitialControlTriggerSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.equal(zone.isLoaded, true);
		assert.equal(zone.isVisible, false);

		teardown();

	});

	it('should handle case: zone empty', async function () {

		const {
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: true });

		zone.show();
		zone.setAsEmpty();

		await controlResolver.resolve(zone);

		assert.equal(shouldTriggerControlSpy.callCount, 1);
		assert.equal(onInitialControlTriggerSpy.callCount, 1);
		assert.equal(onZoneShowSpy.callCount, 1);
		assert.equal(onZoneHideSpy.callCount, 0);
		assert.equal(zone.isLoaded, true);
		assert.equal(zone.isVisible, true);

		teardown();

	});

	it('should handle case: zone loaded, should show zone, should trigger control, should ignore subsequent show calls', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: true });

		zone.show();
		zone.show();
		zone.show();
		zone.setAsLoaded();

		await controlResolver.resolve(zone);

		assert.equal(shouldTriggerControlSpy.callCount, 1);
		assert.equal(onInitialControlTriggerSpy.callCount, 1);
		assert.equal(onZoneShowSpy.callCount, 1);
		assert.equal(onZoneHideSpy.callCount, 0);
		assert.deepEqual(shouldTriggerControlSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.deepEqual(onInitialControlTriggerSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.equal(zone.isLoaded, true);
		assert.equal(zone.isVisible, true);

		teardown();

	});

	it('should handle case: zone loaded, should hide zone, should trigger control, should ignore subsequent hide calls', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: true });

		zone.hide();
		zone.hide();
		zone.hide();
		zone.setAsLoaded();

		await controlResolver.resolve(zone);

		assert.equal(shouldTriggerControlSpy.callCount, 1);
		assert.equal(onInitialControlTriggerSpy.callCount, 1);
		assert.equal(onZoneShowSpy.callCount, 0);
		assert.equal(onZoneHideSpy.callCount, 1);
		assert.deepEqual(shouldTriggerControlSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.deepEqual(onInitialControlTriggerSpy.firstCall.args[0], { element, id, isEmpty: false });
		assert.equal(zone.isLoaded, true);
		assert.equal(zone.isVisible, false);

		teardown();

	});

	it('should handle async case: zone loaded, should hide zone, should trigger control, should show zone before trigger resolves', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: true, triggerTimeout: 1000 });

		zone.hide();
		zone.setAsLoaded();

		await Promise.all([
			zone.show(),
			controlResolver.resolve(zone)
		]);

		assert.equal(onZoneShowSpy.callCount, 1);
		assert.equal(onZoneHideSpy.callCount, 0);
		assert.equal(zone.isLoaded, true);

		teardown();

	});

	it('should handle async case: zone loaded, should show zone, should trigger control, should hide zone before trigger resolves', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			shouldTriggerControlSpy,
			onInitialControlTriggerSpy,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({ shouldTriggerControl: true, triggerTimeout: 1000 });

		zone.show();
		zone.setAsLoaded();

		await Promise.all([
			zone.hide(),
			controlResolver.resolve(zone)
		]);

		assert.equal(onZoneShowSpy.callCount, 0);
		assert.equal(onZoneHideSpy.callCount, 1);
		assert.equal(zone.isLoaded, true);

		teardown();

	});

	it('should destroy instance', async function () {

		const {
			element,
			id,
			zone,
			controlResolver,
			onZoneShowSpy,
			onZoneHideSpy,
			destroySpy,
			teardown
		} = setup({ shouldTriggerControl: true });

		zone.show();
		zone.setAsLoaded();

		await controlResolver.resolve(zone);

		zone.hide();
		controlResolver.destroy();

		await controlResolver.resolve(zone);

		const destroySpyArgs = destroySpy.firstCall.args[0];

		assert.equal(onZoneHideSpy.callCount, 0);
		assert.equal(onZoneShowSpy.callCount, 1);
		assert.equal(destroySpyArgs.element, element);
		assert.equal(destroySpyArgs.id, id);
		assert.equal(destroySpyArgs.initialControlTriggerResult instanceof Promise, true);

		teardown();

	});

});

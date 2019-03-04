import assert from 'assert';
import sinon from 'sinon';
import Zone from '../lib/zone';
import Zones from '../lib/zones';
import Service from '../lib/service';
import Control from '../lib/control';
import Context from '../lib/context';
import ControlResolver from '../lib/control-resolver';
import ContextResolver from '../lib/context-resolver';

function setup ( options = {} ) {

	const {
		calculate = ( list ) => {
			return {
				hidden: list,
				visible: []
			};
		}
	} = options;

	const onZoneShowSpy = sinon.spy();
	const onZoneHideSpy = sinon.spy();

	class DummyControl extends Control {
		async shouldTriggerControl () {
			return true;
		}
		onZoneShow ( ...args ) {
			onZoneShowSpy(...args);
		}
		onZoneHide ( ...args ) {
			onZoneHideSpy(...args);
		}
	}

	class DummyContext extends Context {
		calculate ( list ) {
			return calculate(list);
		}
	}

	const control = new DummyControl();
	const context = new DummyContext();
	const service = new Service();
	const controlResolver = new ControlResolver([control]);
	const zones = new Zones([
		new Zone('becky', document.querySelector('.Zone--becky')),
		new Zone('rufus', document.querySelector('.Zone--rufus')),
		new Zone('loki', document.querySelector('.Zone--loki'))
	], controlResolver, service);
	const contextResolver = new ContextResolver(zones, [context]);

	return {
		controlResolver,
		contextResolver,
		onZoneShowSpy,
		onZoneHideSpy,
		zones,
		context,
		teardown: () => {
			control.destroy();
			context.destroy();
			service.destroy();
			controlResolver.destroy();
			zones.destroy();
			contextResolver.destroy();
		}
	};

}

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

describe('ContextResolver', function () {

	it('should ignore context call if zone is not loaded', async function () {

		const {
			contextResolver,
			controlResolver,
			onZoneShowSpy,
			onZoneHideSpy,
			zones,
			teardown
		} = setup({
			calculate () {
				return {
					visible: [],
					hidden: ['becky', 'rufus', 'loki']
				};
			}
		});

		await contextResolver.resolve();

		assert.equal(onZoneHideSpy.callCount, 0);
		assert.equal(onZoneShowSpy.callCount, 0);

		teardown();

	});

	it('should trigger context call when zone is loaded', async function () {

		const {
			contextResolver,
			onZoneShowSpy,
			onZoneHideSpy,
			teardown
		} = setup({
			calculate () {
				return {
					visible: ['becky'],
					hidden: ['rufus', 'loki']
				};
			}
		});

		await contextResolver.resolve();

		assert.equal(onZoneHideSpy.callCount, 0);
		assert.equal(onZoneShowSpy.callCount, 1);
		assert.equal(onZoneShowSpy.firstCall.args[0].id, 'becky');

		teardown();

	});

	it('should ignore subsequent triggered context calls when zone is loaded', async function () {

		const [ firstCalculateCall, secondCalculateCall ] = [
			() => {
				return {
					visible: ['becky'],
					hidden: ['rufus', 'loki']
				};
			},
			() => {
				return {
					visible: ['rufus', 'loki'],
					hidden: ['becky']
				};
			}
		];

		const {
			contextResolver,
			onZoneShowSpy,
			onZoneHideSpy,
			context,
			teardown
		} = setup({
			calculate: firstCalculateCall
		});

		await contextResolver.resolve();
		await contextResolver.resolve();
		await contextResolver.resolve();

		assert.equal(onZoneHideSpy.callCount, 0);
		assert.equal(onZoneShowSpy.callCount, 1);

		context.calculate = secondCalculateCall;

		await contextResolver.resolve();
		await contextResolver.resolve();
		await contextResolver.resolve();

		assert.equal(onZoneHideSpy.callCount, 1);
		assert.equal(onZoneShowSpy.callCount, 3);

		teardown();

	});

	it('should destroy instance', async function () {

		const {
			contextResolver,
			onZoneHideSpy,
			onZoneShowSpy,
			teardown
		} = setup();

		contextResolver.destroy();

		await contextResolver.resolve();

		assert.equal(onZoneHideSpy.callCount, 0);
		assert.equal(onZoneShowSpy.callCount, 0);

		teardown();

	});

});

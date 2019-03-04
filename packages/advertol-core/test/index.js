import assert from 'assert';
import sinon from 'sinon';
import fn from '../index';
import Service from '../lib/service';
import Control from '../lib/control';
import Context from '../lib/context';

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

describe('Advertol', function () {

	it('should handle empty instance', async function () {

		assert.throws(() => fn(), /^TypeError: Expected a service.$/);

		const instance = fn({
			service: new Service()
		});

		await instance.resolve();

		assert.ok(true);

		instance.destroy();

	});

	it('should handle public method calls', async function () {

		const onZoneShowSpy = sinon.spy();
		const onZoneHideSpy = sinon.spy();

		class DummyService extends Service {
			async writeZone () {
				return true;
			}
		}

		class DummyControl extends Control {
			async shouldTriggerControl () {
				return true;
			}
			onZoneShow () {
				onZoneShowSpy();
			}
		}

		class DummyContext extends Context {
			calculate () {
				return {
					visible: ['becky'],
					hidden: []
				};
			}
		}

		const instance = fn({
			service: new DummyService(),
			zones: [{ id: 'becky', element: document.querySelector('.Zone--becky') }],
			control: [new DummyControl()],
			context: [new DummyContext()]
		});

		await instance.resolve();

		assert.equal(onZoneShowSpy.callCount, 1);

		const context = new DummyContext();
		context.calculate = () => {
			return {
				visible: ['rufus'],
				hidden: ['becky']
			};
		};

		const control = new DummyControl();
		control.onZoneHide = () => {
			onZoneHideSpy();
		};
		control.onZoneShow = () => {};

		instance.addZone({
			id: 'rufus',
			element: document.querySelector('.Zone--rufus')
		});

		instance.addContext(context);
		instance.addControl(control);

		await instance.resolve();

		assert.equal(onZoneShowSpy.callCount, 2);
		assert.equal(onZoneHideSpy.callCount, 1);

		instance.destroy();

	});

});

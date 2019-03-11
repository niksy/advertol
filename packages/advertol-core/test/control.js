import assert from 'assert';
import sinon from 'sinon';
import Control from '../lib/control';

describe('Control', function () {

	it('should create instance', async function () {

		const spy = sinon.spy();
		const control = new Control();

		control.onZoneShow = spy;
		control.onZoneHide = spy;

		const shouldTriggerControlResult = await control.shouldTriggerControl();
		const onInitialControlTriggerResult = await control.onInitialControlTrigger();

		control.onZoneShow();
		control.onZoneHide();

		assert.equal(shouldTriggerControlResult, false);
		assert.equal(typeof onInitialControlTriggerResult, 'undefined');
		assert.equal(spy.callCount, 2);

		control.destroy();

	});

});

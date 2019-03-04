import assert from 'assert';
import sinon from 'sinon';
import Control from '../lib/control';

describe('Control', function () {

	it('should create instance', async function () {

		const spy = sinon.spy();
		const control = new Control();

		control.onZoneShow = spy;
		control.onZoneHide = spy;

		const triggerResult = await control.shouldTriggerControl();
		const loadResult = await control.afterZoneLoad();

		control.onZoneShow();
		control.onZoneHide();

		assert.equal(triggerResult, false);
		assert.equal(typeof loadResult, 'undefined');
		assert.equal(spy.callCount, 2);

		control.destroy();

	});

});

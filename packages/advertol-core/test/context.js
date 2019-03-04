import assert from 'assert';
import sinon from 'sinon';
import Context from '../lib/context';

describe('Context', function () {

	it('should create instance', function () {

		const context = new Context();

		context.resolve();

		assert.equal(typeof context._resolveAll, 'function');

		context.destroy();

	});

	it('should have properly overriden `resolve` method', function () {

		const spy = sinon.stub();
		const context = new Context();

		context._resolveAll = spy;

		context.resolve();

		assert.equal(spy.callCount, 1);

		context.destroy();

	});

});

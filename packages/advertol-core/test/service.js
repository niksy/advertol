import assert from 'assert';
import sinon from 'sinon';
import Service from '../lib/service';

describe('Service', function () {

	it('should create instance', async function () {

		const service = new Service();

		const writeResult = await service.writeZone();

		assert.equal(writeResult, true);

		service.destroy();

	});

});

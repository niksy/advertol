import assert from 'assert';
import Zone from '../lib/zone';

function setup ( options = {} ) {

	const {
		id = 'becky',
		element = document.querySelector('.Zone')
	} = options;

	const zone = new Zone(id, element);

	return {
		element,
		id,
		zone,
		teardown: () => {
			zone.destroy();
		}
	};

}

before(function () {
	window.fixture.load('/test/fixtures/index.html');

});

after(function () {
	window.fixture.cleanup();
});

describe('Zone', function () {

	it('should create instance', function () {

		const {
			element,
			id,
			zone,
			teardown
		} = setup();

		assert.throws(() => setup({ id: null }), /^TypeError: Expected a string.$/);
		assert.throws(() => setup({ element: null }), /^TypeError: Expected an element.$/);

		assert.equal(id, zone.id);
		assert.ok(zone.element.isSameNode(element));

		teardown();

	});

	it('should set visibility state', function () {

		const {
			zone,
			teardown
		} = setup();

		assert.equal(zone.isVisible, false);

		zone.show();

		assert.equal(zone.isVisible, true);

		zone.hide();

		assert.equal(zone.isVisible, false);

		teardown();

	});

	it('should set loaded state', function () {

		const {
			zone,
			teardown
		} = setup();

		assert.equal(zone.isLoaded, false);
		assert.equal(zone.isEmpty, false);

		zone.setAsLoaded();

		assert.equal(zone.isLoaded, true);
		assert.equal(zone.isEmpty, false);

		zone.setAsEmpty();

		assert.equal(zone.isLoaded, true);
		assert.equal(zone.isEmpty, true);

		teardown();

	});

	it('should destroy instance', function () {

		const {
			zone,
			teardown
		} = setup();

		zone.destroy();

		assert.equal(zone.isVisible, false);

		teardown();

	});

});

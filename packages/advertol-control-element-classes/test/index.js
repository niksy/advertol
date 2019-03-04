import assert from 'assert';
import advertol, { Context, Service } from '@advertol/core';
import Control from '../index';

function setup ( options = {} ) {

	const {
		isEmpty = false,
		calculate = ( list ) => {
			return {
				visible: list,
				hidden: []
			};
		}
	} = options;

	class DummyContext extends Context {
		constructor () {
			super();
			this.resolve();
		}
		calculate ( list ) {
			return calculate(list);
		}
	}

	class DummyService extends Service {
		async writeZone () {
			if ( isEmpty ) {
				return false;
			}
			return true;
		}
	}

	const element = document.querySelector('.becky');

	const instance = advertol({
		zones: [{
			id: 'becky',
			element: element
		}],
		service: new DummyService(),
		context: [
			new DummyContext()
		],
		control: [
			new Control({
				isVisible: 'is-visible',
				isHidden: 'is-hidden',
				isLoaded: 'is-loaded',
				isEmpty: 'is-empty'
			})
		]
	});

	return {
		instance,
		element,
		teardown: () => {
			instance.destroy();
		}
	};

}

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

it('should apply visible element classes', async function () {

	const {
		instance,
		element,
		teardown
	} = setup({
		calculate: () => {
			return {
				visible: ['becky'],
				hidden: []
			};
		}
	});

	await instance.resolve();

	assert.ok(element.classList.contains('is-loaded'));
	assert.ok(element.classList.contains('is-visible'));

	teardown();

});

it('should apply hidden element classes', async function () {

	let count = 0;

	const {
		instance,
		element,
		teardown
	} = setup({
		calculate: () => {
			if ( count === 0 ) {
				return {
					visible: ['becky'],
					hidden: []
				};
			}
			return {
				visible: [],
				hidden: ['becky']
			};
		}
	});

	await instance.resolve();

	count = count + 1;

	await instance.resolve();

	assert.ok(element.classList.contains('is-loaded'));
	assert.ok(element.classList.contains('is-hidden'));

	teardown();

});

it('should apply empty element classes', async function () {

	const {
		instance,
		element,
		teardown
	} = setup({
		isEmpty: true,
		calculate: () => {
			return {
				visible: ['becky'],
				hidden: []
			};
		}
	});

	await instance.resolve();

	assert.ok(element.classList.contains('is-loaded'));
	assert.ok(element.classList.contains('is-empty'));

	teardown();

});

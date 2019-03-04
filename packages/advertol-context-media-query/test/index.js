import assert from 'assert';
import advertol, { Control, Service } from '@advertol/core';
import Context from '../index';

function matchMediaEvents () {
	return new Promise(( resolve ) => {
		setTimeout(resolve, 100);
	});
}

function setup ( options = {} ) {

	let visible = [];
	let hidden = [];

	class DummyControl extends Control {
		async shouldTriggerControl () {
			return true;
		}
		onZoneShow ({ id }) {
			const index = hidden.findIndex(( item ) => id === item);
			if ( index >= 0 ) {
				hidden.splice(index, 1);
			}
			visible.push(id);
			hidden.sort();
			visible.sort();
		}
		onZoneHide ({ id }) {
			const index = visible.findIndex(( item ) => id === item);
			if ( index >= 0 ) {
				visible.splice(index, 1);
			}
			hidden.push(id);
			visible.sort();
			hidden.sort();
		}
	}

	const instance = advertol({
		zones: [
			{
				id: 'becky',
				element: document.querySelector('.becky')
			},
			{
				id: 'casey',
				element: document.querySelector('.casey')
			},
			{
				id: 'gracie',
				element: document.querySelector('.gracie')
			}
		],
		service: new Service(),
		context: [
			new Context({
				'screen and (max-width:599px)': ['becky'],
				'screen and (min-width:728px) and (max-width:914px)': [ 'casey', 'gracie' ],
				'screen and (min-width:900px) and (max-width:999px)': [ 'becky' ]
			})
		],
		control: [
			new DummyControl()
		]
	});

	return {
		instance,
		visible,
		hidden,
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

it('should handle media query context', async function () {

	const {
		instance,
		visible,
		hidden,
		teardown
	} = setup();

	window.viewport.set(500, 600);
	await matchMediaEvents();
	await instance.resolve();

	assert.deepEqual(visible, ['becky']);
	assert.deepEqual(hidden, []);

	window.viewport.set(800, 600);
	await matchMediaEvents();
	await instance.resolve();

	assert.deepEqual(visible, ['casey', 'gracie']);
	assert.deepEqual(hidden, ['becky']);

	window.viewport.set(900, 600);
	await matchMediaEvents();
	await instance.resolve();

	assert.deepEqual(visible, ['becky', 'casey', 'gracie']);
	assert.deepEqual(hidden, []);

	window.viewport.set(1000, 600);
	await matchMediaEvents();
	await instance.resolve();

	assert.deepEqual(visible, []);
	assert.deepEqual(hidden, ['becky', 'casey', 'gracie']);

	teardown();

	window.viewport.set(500, 600);
	await matchMediaEvents();
	await instance.resolve();

	assert.deepEqual(visible, []);
	assert.deepEqual(hidden, ['becky', 'casey', 'gracie']);

});

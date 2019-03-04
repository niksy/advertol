import { Control } from '@advertol/core';

function addClass ( element, className ) {
	if ( className === '' ) {
		return;
	}
	element.classList.add(className);
}

function removeClass ( element, className ) {
	if ( className === '' ) {
		return;
	}
	element.classList.remove(className);
}

class ElementClassesControl extends Control {

	/**
	 * @param  {Object} classes
	 * @param  {string} classes.isVisible
	 * @param  {string} classes.isHidden
	 * @param  {string} classes.isLoaded
	 * @param  {string} classes.isEmpty
	 */
	constructor ( classes = {} ) {
		super();

		const {
			isVisible = '',
			isHidden = '',
			isLoaded = '',
			isEmpty = ''
		} = classes;

		this.elements = [];

		this.classes = {
			isVisible,
			isHidden,
			isLoaded,
			isEmpty
		};
	}

	shouldTriggerControl () {
		return Promise.resolve(true);
	}

	afterZoneLoad ({ element, isEmpty }) {
		this.elements.push(element);
		addClass(element, this.classes.isLoaded);
		if ( isEmpty ) {
			addClass(element, this.classes.isEmpty);
		}
		return Promise.resolve();
	}

	onZoneShow ({ element }) {
		removeClass(element, this.classes.isHidden);
		addClass(element, this.classes.isVisible);
	}

	onZoneHide ({ element }) {
		removeClass(element, this.classes.isVisible);
		addClass(element, this.classes.isHidden);
	}

	destroy () {
		[
			this.classes.isHidden,
			this.classes.isLoaded,
			this.classes.isEmpty
		]
			.join(' ')
			.split(' ')
			.filter(( str ) => str.trim() !== '')
			.forEach(( className ) => {
				this.elements.forEach(( element ) => {
					removeClass(element, className);
				});
			});
	}
}

export default ElementClassesControl;

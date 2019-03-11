import { Control } from '@advertol/core';

/**
 * @param  {HTMLElement} element
 * @param  {string} className
 * @param  {string} action
 */
function manipulateWithClasses ( element, className, action ) {
	if ( className.trim() === '' ) {
		return;
	}
	className
		.split(' ')
		.map(( str ) => str.trim())
		.filter(( str ) => str !== '')
		.forEach(( str ) => {
			element.classList[action](str);
		});
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
function addClass ( element, className ) {
	manipulateWithClasses(element, className, 'add');
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
function removeClass ( element, className ) {
	manipulateWithClasses(element, className, 'remove');
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

	onInitialControlTrigger ({ element, isEmpty }) {
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

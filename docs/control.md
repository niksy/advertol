# Control

Control adds additional functionality for each zone. For example, you can create control to apply HTML classes on zone DOM nodes when the node is loaded, hidden or shown, or to asynchronously load dependencies for zone (e.g. `position: sticky` polyfill for scrollable halfpage zones).

Control is called when zone is loaded.

Custom control should extend `Control` class available as named export from `@advertol/core` package.

When control is added to Advertol instance, it is bound to that instance. If you want to use same control in another Advertol instance, create new control instance.

## API

### shouldTriggerControl({ element, id, isEmpty })

Returns: `Promise<boolean>`

Should this control be triggered. If true, continues with executing lifecycle hooks (`afterZoneLoad`, `onZoneShow` and `onZoneHide`), otherwise stops executing control.

After `Promise` is resolved, its value is cached for zone ID and it won’t execute again. Every other call to control instance for particular will use already cached value.

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |
| `isEmpty` | `boolean` | Is zone response empty. |

### afterZoneLoad({ element, id, isEmpty })

Returns: `Promise<*>`

Execute additional asynchronous code before continuing on to next lifecycle hooks (`onZoneShow` and `onZoneHide`). For example, you can asynchronously load dependencies for particular zone.

After `Promise` is resolved, its value is cached for zone ID and it won’t execute again. Every other call to control instance for particular will use already cached value.

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |
| `isEmpty` | `boolean` | Is zone response empty. |

### onZoneShow({ element, id, loadResult, isEmpty })

Lifecycle hook triggered when zone is visible.

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |
| `loadResult` | `*` | `Promise` load result returned from `afterZoneLoad` hook. |
| `isEmpty` | `boolean` | Is zone response empty. |

### onZoneHide({ element, id, loadResult, isEmpty })

Lifecycle hook triggered when zone is hidden.

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |
| `loadResult` | `*` | `Promise` load result returned from `afterZoneLoad` hook. |
| `isEmpty` | `boolean` | Is zone response empty. |

### destroy({ element, id, loadResult, isEmpty })

Lifecycle hook triggered when zone control is destroyed.

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |
| `loadResult` | `*` | `Promise` load result returned from `afterZoneLoad` hook. |
| `isEmpty` | `boolean` | Is zone response empty. |

## Usage

Let’s create control which will add HTML classes to zone DOM element if they’re hidden, loaded or empty.

```js
import advertol, { Control } from '@advertol/core';

class HTMLClassesControl extends Control {

	constructor ( elements, classes ) {
		super();
		this.elements = [].slice.call(elements);
		this.classes = classes;
	}

	// We want to trigger this control always
	shouldTriggerControl () {
		return Promise.resolve(true);
	}

	afterZoneLoad ({ element, isEmpty }) {

		// Zone is loaded so we add "loaded" class
		element.classList.add(this.classes.isLoaded);

		// If it’s empty we also want to add "empty" class
		if ( isEmpty ) {
			element.classList.add(this.classes.isEmpty);
		}

		return Promise.resolve();

	}

	onZoneShow ({ element, isEmpty }) {
		// Remove any "hidden" classes left from other hook calls
		element.classList.remove(this.classes.isHidden);
	}

	onZoneHide ({ element, isEmpty }) {
		// Add "hidden" class
		element.classList.add(this.classes.isHidden);
	}

	destroy () {

		// Remove any classes added by this control on destroy
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
					element.classList.remove(className);
				});
			});
	}

}

const instance = advertol({
	// Other options ommited for clarity
	control: [
		new HTMLClassesControl(document.querySelectorAll('.Zone'), {
			isHidden: 'is-hidden',
			isLoaded: 'is-loaded',
			isEmpty: 'is-empty'
		})
	]
});

instance.resolve();
```

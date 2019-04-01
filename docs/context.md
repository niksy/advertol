# Context

Context tells Advertol which zones should be visible (and loaded if not already loaded) or hidden depending on various conditions. For example, you could have context which sets up [media query listeners](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) and reveals or hides particular zones if media query is matched or unmatched, or handle zone visibility if zone is inside viewport.

Contexts are chainable and each receives currently resolved state from previous context. Their resolve order is prioritized by their position in context array in Advertol instance (first added context is resolved first, second one second, and so on).

Custom context should extend `Context` class available as named export from `@advertol/core` package.

When context is added to Advertol instance, it is bound to that instance. If you want to use same context in another Advertol instance, create new context instance.

## API

### calculate(visibleZoneIds)

Returns: `Object`

Calculates next context state. Method should return object with two properties:

* `visible`, with array of zone IDs which should be visible
* `hidden`, with array of zone IDs which should be hidden

Result of this method is passed on to the next context in array of registered contexts, or if no other context is available, resolved to either show (and load if not already loaded) or hide zones.

| Property | Type | Description |
| --- | --- | --- |
| `visibleZoneIds` | `string[]` | List of currently visible zone IDs. |

### resolve()

In most cases, this method should be left as is. It’s connected to Advertol instance control resolver which calls all other contexts in order and tells them to resolve new visibility state.

You should call this method either when instantiating context instance, or when any asynchronous operation is completed—for example, this method should be called inside media query listener callback.

### destroy()

Lifecycle hook triggered when context is destroyed.

## Usage

Let’s create context which will hide every zone if we set some global variable to `true`.

```js
import advertol, { Context } from '@advertol/core';

class GlobalVariableAwareContext extends Context {

	constructor ( variableName ) {
		super();
		this.variableName = variableName;
		this.resolve();
	}

	calculate ( visibleZoneIds ) {
		// If variable resolves to true, hide every zone
		if (
			(this.variableName in window) &&
			window[this.variableName] === true
		) {
			return {
				visible: [],
				hidden: visibleZoneIds
			};
		}
		// By default return existing state;
		return {
			visible: visibleZoneIds,
			hidden: []
		};
	}

}

const instance = advertol({
	// Other options ommited for clarity
	context: [
		new GlobalVariableAwareContext('hideZones')
	]
});

// Zones are left as is since there is no global `window.hideZones` variable
// We also need to wait for asynchronous result
instance.resolve()
	.then(() => {

		// Set global variable to true
		window.hideZones = true;

		// Zones should be hidden now since global variable `window.hideZones` is set to true
		return instance.resolve();

	});
```

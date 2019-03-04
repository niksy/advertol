# Service

Service is any advertisement server implementation such as [Google DFP (Ad Manager)](https://admanager.google.com/home/) or [Revive Adserver](https://www.revive-adserver.com/).

Custom service should extend `Service` class available as named export from `@advertol/core` package.

## API

### afterZoneRegistered({ element, id })

Lifecycle hook triggered after zone is registered in Advertol instance.

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |

### writeZone({ element, id })

Returns: `Promise<Boolean>`

Lifecycle hook triggered immediately when zone write process is triggered.

If `Promise` resolves to `true`, zone is considered filled, and if it resolves to `false`, zone is considered to have empty content.

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |

### beforeWriteZones(zones)

Lifecycle hook triggered immediately before zone write process is triggered.

#### zones

Type: `Object[]`

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |

### afterWriteZones(zones)

Lifecycle hook triggered immediately after zone write process is triggered, but before `writeZone` lifecycle hook is resolved.

#### zones

Type: `Object[]`

| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Zone DOM element. |
| `id` | `string` | Zone ID. |

### destroy()

Lifecycle hook triggered when service is destroyed.

## Usage

Let’s create service which will populate zone DOM nodes with content inside object passed on instantiation.

```js
import advertol, { Service } from '@advertol/core';

class ContentService extends Service {

	constructor ( content ) {
		super();
		this.content = content;
	}

	writeZone ({ element, id }) {

		return new Promise(( resolve, reject ) => {

			// Get zone content from initial object
			const content = this.content[id];

			// Check for empty state
			if ( content === '' ) {
				element.innerHTML = content;
				resolve(false);
				return;
			}

			element.innerHTML = content;
			resolve(true);

		});

	}

}

const instance = advertol({
	// Other options ommited for clarity
	service: [
		new ContentService({
			becky: 'Becky content'
		})
	]
});

instance.resolve();
```

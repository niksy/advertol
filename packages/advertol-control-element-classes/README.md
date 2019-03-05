# @advertol/control-element-classes

[![Build Status][ci-img]][ci] [![BrowserStack Status][browserstack-img]][browserstack]

Add HTML classes to zone DOM elements based on zone state.

## Install

```sh
npm install @advertol/control-element-classes --save
```

## Usage

```js
import advertol from '@advertol/core';
import ElementClassesControl from '@advertol/control-element-classes';

const instance = advertol({
	// …
	control: [
		new ElementClassesControl({
			isHidden: 'is-hidden',
			isLoaded: 'is-loaded',
			isEmpty: 'is-empty'
		})
	]
});

instance.resolve();
```

## API

### elementClassesControl(classes)

#### classes

Type: `Object`

HTML classes to apply on zone DOM element based on current state.

| Property | Type | Description |
| --- | --- | --- |
| `isHidden` | `string` | HTML class when zone is hidden. |
| `isLoaded` | `string` | HTML class when zone is loaded. |
| `isEmpty` | `string` | HTML class when zone is empty. |

## Browser support

Tested in IE9+ and all modern browsers, assuming `Element.prototype.classList` is available.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.com/niksy/advertol
[ci-img]: https://travis-ci.com/niksy/advertol.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=TE8rKzdwQjE2K2xqaEw0MitWT3JURXFWYnl4dnIrUGREL1Z6MFdHdWxFQT0tLURBWHJBcUJ4cHZybFAvbGVsNitDbGc9PQ==--247cebb635b01ab1cbf57ab8a6b5f5bb4bc6ac93

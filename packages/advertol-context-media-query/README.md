# @advertol/context-media-query

[![Build Status][ci-img]][ci] [![BrowserStack Status][browserstack-img]][browserstack]

Control zone visibility with [CSS media query][media-queries] listeners.

## Install

```sh
npm install @advertol/context-media-query --save
```

## Usage

```js
import advertol from '@advertol/core';
import MediaQueryContext from '@advertol/context-media-query';

const instance = advertol({
	// …
	context: [
		new MediaQueryContext({
			'screen and (min-width:1000px) and (max-width:1199px)': [ 'becky', 'lucy', 'maggie' ],
			'screen and (min-width:1500px)': [ 'becky', 'lucy', 'maggie', 'madison', 'ziggy', 'ruby' ],
			'screen and (min-width:915px) and (max-width:999px)': [ 'becky', 'lucy', 'maggie', 'maggie' ],
			'screen and (min-width:1200px) and (max-width:1499px)': [ 'becky', 'lucy', 'maggie', 'madison', 'ziggy' ],
			'screen and (min-width:728px) and (max-width:914px)': [ 'becky', 'maggie' ],
			'screen and (max-width:599px)': ['bruno']
		})
	]
});

instance.resolve();
```

## API

### mediaQueryContext(contexts)

#### contexts

Type: `Object`

List of media query contexts and zones for context.

Each object property has:

* Key, which is [CSS media query selector][media-queries]
* Value, which is array of zone IDs visible in that media query context

## Browser support

Tested in IE9+ and all modern browsers, assuimg `window.matchMedia` and `window.matchMedia` listeners support is available.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.com/niksy/advertol
[ci-img]: https://travis-ci.com/niksy/advertol.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=ZXVsVDVhem9zZmNjQWVKV2ZvZUtiK1RCZlA2ajg2dDZmOTVIV0tZck5Xdz0tLTRQVkRYcVVPWU8xK0lJR3o3Z1gzUEE9PQ==--24a91b3152c00c01a8af853126eaf873886db782
[media-queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries

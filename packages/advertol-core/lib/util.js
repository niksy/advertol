function memoizePromise ({ key, cache, result }) {
	if ( cache[key] instanceof Promise ) {
		return cache[key];
	}
	cache[key] = result();
	return cache[key];
}

export {
	memoizePromise
};

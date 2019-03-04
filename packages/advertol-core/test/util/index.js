function setTimeoutAsPromise ( timeout ) {
	return new Promise(( resolve ) => {
		setTimeout(resolve, timeout);
	});
};

export {
	setTimeoutAsPromise
};

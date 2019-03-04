require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');
const testsContext = require.context('.', true, /^((?!(\.webpack|fixtures\/)).)*\.js$/);
testsContext.keys().forEach(testsContext);

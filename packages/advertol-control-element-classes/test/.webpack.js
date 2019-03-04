require('dom4');
const testsContext = require.context('.', true, /^((?!(\.webpack|fixtures\/)).)*\.js$/);
testsContext.keys().forEach(testsContext);

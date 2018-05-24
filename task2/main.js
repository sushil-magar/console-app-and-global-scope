definedModules = {};

define = function(moduleName, fn) {
  definedModules[moduleName] = fn;
}

require = function(moduleName) {
  const module = definedModules[moduleName];

  if (!module) {
    throw new Error(`This module ${moduleName} is not available.`);
  }
  
  return definedModules[moduleName];
}

define('sum', (a, b) => a + b);
const sum = require('sum');
console.log('Sum::', sum(5, 8));


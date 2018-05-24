'use strict';
let definedModules = {};

function define(moduleName, fn) {
  definedModules[moduleName] = fn;
}

function require(moduleName) {
  return definedModules[moduleName];
}

define('sum', (a, b) => a + b);
const sum = require('sum');
console.log(sum(2,2));



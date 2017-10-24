/**
 * @fileoverview Utility functions for imports/requires
 */
'use strict';

function getNameFromCjsRequire(init) {
  if (
    init &&
    init.callee &&
    init.callee.name === 'require' &&
    init.arguments &&
    init.arguments.length === 1 &&
    init.arguments[0].type === 'Literal'
  ) {
    return init.arguments[0].value;
  }
  return '';
}

module.exports = {
  getNameFromCjsRequire: getNameFromCjsRequire
};

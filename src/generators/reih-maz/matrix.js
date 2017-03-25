const utils = require('../../utils');

const matrix = function(Q) {
  return `Q =\r\n${utils.stringifyMatrix(Q)}\r\n`;
}

module.exports = matrix;

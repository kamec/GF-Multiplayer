const BigInt = require('big-integer');
const utils = require('../utils');

const generateCode = function(Q) {
  const size = Q[0].length;
  let result = '';
  result += generateStatic(size);
  result += generateSplittingArray(size);
  result += generateSplitting(size);
  result += generateTeplitsMatricesBuilding(size);
  result += generateResultVectorCalculation(Q, size);
  result += generateMultiplicationResult(size);
  return result;
};

module.exports = generateCode;

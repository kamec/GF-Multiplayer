const BigInt = require('big-integer');
const multiplier = require('../matrixBuilder');
const utils = require('../utils');

const generateCode = function(Q) {
  const  size = Q[0].length;
  let generatedCode = '';
  generatedCode += `public class Generator {\r\n`;
  generatedCode += `\tpublic static long main(long A, long B) {\r\n`;

  generatedCode += `\t}\r\n`;
  generatedCode += `}\r\n`;
  return generatedCode;
}

module.exports = generateCode;

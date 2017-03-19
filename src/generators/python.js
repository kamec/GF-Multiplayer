const BigInt = require('big-integer');
const utils = require('../utils');

const generateCode = function(Q) {
  const size = Q[0].length;
  let result = '';
  result += generateStatic();
  result += generateSplittingArray(size);
  result += generateSplitting(size);
  result += generateTeplitsMatricesBuilding(size);
  result += generateResultVectorCalculation(Q, size);
  result += generateMultiplicationResult(size);
  return result;
};

function generateStatic() {
  let result = '';
  result += 'class Generator:\r\n';
  result += '\tdef calculate(self, A: int, B: int):\r\n';
  return result;
};

function generateSplittingArray(size) {
  let result = '';
  result += '\t\tarPos = [';
  for (let i = 0; i < size; i++) {
    result += `${BigInt(2).pow(i)}${i < size - 1 ? ', ' : ''}`;
  }
  result += `]\r\n`;
  return result += `\r\n`;
};

function generateSplitting(size) {
  let result = '';
  result += `\t\ta = [(A & arPos[i]) >> i for i in range(${size})]\r\n`;
  result += `\t\tb = [(B & arPos[i]) >> i for i in range(${size})]\r\n`;
  return result += `\r\n`;
};

function generateTeplitsMatricesBuilding(size) {
  let result = '';
  result += `\t\td = [None] * ${size}\r\n`;
  result += `\t\te = [None] * ${size - 1}\r\n`;
  result += `\r\n`;
  result += `\t\tfor i in range(${size}):\r\n`
  result += `\t\t\td[i] = a[0] & b[i]\r\n`;
  result += `\t\t\tfor j in range(1, i+1):\r\n`;
  result += `\t\t\t\td[i] ^= a[j] & b[i-j]\r\n`;
  result += `\r\n`;
  result += `\t\tfor i in range(${size - 1}):\r\n`;
  result += `\t\t\te[i] = a[i+1] & b[${size - 1}]\r\n`;
  result += `\t\t\tfor j in range(i+2, ${size}):\r\n`;
  result += `\t\t\t\te[i] ^= a[j] & b[${size}-j+i]\r\n`;
  return result += `\r\n`;
};

function generateResultVectorCalculation(Q, size) {
  const preparedMatrix = utils.prepareMatrix(Q);
  
  let result = '';
  result += `\t\tc = [`;
  for (let i = 0; i < size; i++) {
    result += `(d[${i}]`;
    preparedMatrix[i].forEach(position => result += `^e[${position}]`);
    result += `)${i === 0 ? '' : ` << ${i}`}${i < size - 1 ? ',\r\n\t\t\t ': ']\r\n'}`;
  }
  return result += '\r\n';
};

function generateMultiplicationResult(size) {
  let result = '';
  result += '\t\tC = ';
  for (let i = 0; i < size; i++) {
    result += `c[${i}]${i !== size - 1 ? '^' : '\r\n'}`;
  }

  result += `\t\tprint("{0:b}".format(C))\r\n`
  result += `\t\treturn "{0:b}".format(C)\r\n`
  return result;
};

module.exports = generateCode;

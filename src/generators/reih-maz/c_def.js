const BigInt = require('big-integer');
const utils = require('../../utils');

const generateCode = function(Q) {
  const size = Q[0].length;

  let result = ;
  result += generateSplitting('a', size);
  result += generateSplitting('b', size);
  result += generateTeplitsMatricesBuilding(size);
  result += generateResultVectorCalculation(Q, size);
  result += generateMultiplicationResult(size);

  return result;
};

function generateStatic() {
  let result = '';
  result += '\#include <stdio.h>\r\n';
  result += '\#include <stdlib.h>\r\n';
  return result;
};

function generateSplitting(letter, size) {
  let result = '';
  for (let i = 0; i < size; i++) {
    result += `#define ${letter}${i}\t((${letter.toUpperCase()}&${BigInt(2).pow(i)})${i !== 0 ? '>>' + i : ''})\r\n`;
  }
  return result += '\r\n';
};

function generateTeplitsMatricesBuilding(size) {
  let result = '';
  for (let i = 0; i < size; i++) {
    result += `#define d${i}\t`;
    for (let j = 0; j <= i; j++) {
      result += `(a${i - j}&b${j}) ${i === j ? '\r\n' : '^ '}`;
    }
  };

  size = size - 1;
  for (let i = 0; i < size; i++) {
    result += `#define e${i}\t`;
    for (let j = 0; j <= size - 1 - i; j++) {
      result += `(a${size - j}&b${j + i + 1}) ${i === size - 1 - j ? '\r\n' : '^ '}`;
    }
  }

  return result += '\r\n';
};

function generateResultVectorCalculation(Q, size) {
  const preparedMatrix = utils.prepareMatrix(Q);

  let result = '';
  for (let i = 0; i < size; i++) {
    result += `#define c${i}\t((d${i}`;
    preparedMatrix[i].forEach(position => result += `^e${position}`);
    result += `)${i === 0 ? '' : ` << ${i}`})\r\n`
  }
  return result += '\r\n';
};

function generateMultiplicationResult(size) {
  let result = '#define cmul (';
  for (let i = 0; i < size; i++) {
    result += `${i === 0 ? '' : '^'}c${i}`;
  }
  result += ')\r\n';
  result += `int main(int argc, char *argv[]) {\r\n`
  result += `\tchar *pCh;\r\n`
  result += `\tunsigned int A = strtoul(argv[1], &pCh, 2);\r\n`
  result += `\tunsigned int B = strtoul(argv[2], &pCh, 2);\r\n`
  result += `\tunsigned int C;\r\n`
  result += `\tC = cmul;\r\n`
  result += `\tprintf("%d\\r\\n", C);\r\n`
  result += `\treturn C;\r\n`
  result += `}\r\n`;
  return result;
};

module.exports = generateCode;

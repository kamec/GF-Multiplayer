const BigInt = require('big-integer');
const utils = require('../utils');

const generateCode = function(Q) {
  const size = Q[0].length;

  let generatedCode = generateResultVectorCalculation(Q, size);
  generatedCode += generateStatic();
  generatedCode += generateSplittingArray(size);
  generatedCode += generateSplitting(size);
  generatedCode += generateTeplitsMatricesBuilding(size);
  generatedCode += generateMultiplicationResult(size);

  return generatedCode;
};

function generateResultVectorCalculation(Q, size) {
  const QT = utils.transposeMatrix(Q);
  const preparedMatrix = QT.map(V => V.map((el, idx) => ({el: el, idx: idx})).filter(cell => cell.el !== 0).map(cell => cell.idx));

  let result = '';
  for (let i = 0; i < size; i++) {
    result += `#define c${i}\t((d[${i}]`;
    preparedMatrix[i].forEach(position => result += `^e[${position}]`);
    result += `)${i === 0
      ? ''
      : ` << ${i}`})\r\n`;
  }
  return result += '\r\n';
};

function generateStatic() {
  let result = `\#include <stdio.h>\r\n`;
  result += `\#include <stdlib.h>\r\n`;
  result += `int main(int argc, char *argv[])\r\n`;
  result += `{\r\n`;
  result += `\tchar *pCh;\r\n`;
  result += `\tunsigned int i, j;\r\n`;
  result += `\tunsigned int A = strtoul(argv[1], &pCh, 2);\r\n`;
  result += `\tunsigned int B = strtoul(argv[2], &pCh, 2);\r\n`;
  result += `\r\n`;
  return result;
};

function generateSplittingArray(size) {
  let result = `\tunsigned int arPos[${size}] = {`;
  for (let i = 0; i < size; i++) {
    result += `${BigInt(2).pow(i)}${i < size - 1 ? ', ' : ''}`;
  }
  result += '};\r\n'
  result += `\tunsigned int a[${size}];\r\n`;
  result += `\tunsigned int b[${size}];\r\n`;
  return result;
};

function generateSplitting(size) {
  let result = `\tfor (i = 0; i < ${size}; i++) {\r\n`;
  result += splitter('a');
  result += splitter('b');
  result += `\t}\r\n`;
  return result += `\r\n`
};

function splitter(letter) {
  return `\t\t${letter.toLowerCase()}[i] = (${letter.toUpperCase()} & arPos[i]) >> i;\r\n`;
};

function generateTeplitsMatricesBuilding(size) {
  let result = '';
  result += `\tunsigned int d[${size}];\r\n`;
  result += `\tunsigned int e[${size - 1}];\r\n`;

  result += `\tfor (i = 0; i < ${size}; i++) {\r\n`;
  result += `\t\td[i] = a[0]&b[i];\r\n`;
  result += `\t\tfor (j = 1; j <= i; j++) {\r\n`;
  result += `\t\t\td[i] ^= a[j]&b[i - j];\r\n`;
  result += `\t\t}\r\n`;
  result += `\t}\r\n`;

  result += `\tfor (i = 1; i < ${size}; i++) {\r\n`;
  result += `\t\te[i-1] = a[i]&b[${size - 1}];\r\n`;
  result += `\t\tfor (j = i + 1;  j < ${size}; j++) {\r\n`;
  result += `\t\t\te[i-1] ^= a[j]&b[${size - 1} - j + i];\r\n`;
  result += `\t\t}\r\n`;
  result += `\t}\r\n`;

  return result += '\r\n';
};

function generateMultiplicationResult(size) {
  let result = '';

  result += '\tunsigned int C = ';
  for (let i = 0; i < size; i++) {
    result += `c${i}${i !== size - 1 ? '^' : ';\r\n'}`;
  }

  result += `\tprintf("%d\\r\\n", C);\r\n`
  result += `\treturn C;\r\n`
  result += `}`;

  return result += '\r\n';
};

module.exports = generateCode;

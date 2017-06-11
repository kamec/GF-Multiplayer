const BigInt = require('big-integer');

const generateCode = function(Q, size) {
  let result = generateStatic();
  result += generateSplittingArray(size);
  result += generateSplitting(size);
  result += generateTeplitsMatricesBuilding(size);
  result += generateResultVectorCalculation(Q, size);
  result += generateMultiplicationResult(size);
  
  return result;
};

function generateStatic() {
  let result = `#include <stdio.h>
  #include <stdlib.h>
  int main(int argc, char *argv[]) {
    char *pCh;
    unsigned int i, j;
    unsigned int A = strtoul(argv[1], &pCh, 2);
    unsigned int B = strtoul(argv[2], &pCh, 2);`;
  return result += `\r\n\r\n`;
};

function generateSplittingArray(size) {
  let result = `\tunsigned int arPos[${size}] = {`;
  for (let i = 0; i < size; i++) {
    result += `${BigInt(2).pow(i)}${i < size - 1 ? ', ' : ''}`;
  }
  result += `};
  unsigned int a[${size}];
  unsigned int b[${size}];`;
  return result += '\r\n';
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
  let result = `
  unsigned int d[${size}];
  unsigned int e[${size - 1}];
  
  for (i = 0; i < ${size}; i++) {
    d[i] = a[0]&b[i];
    for (j = 1; j <= i; j++) {
      d[i] ^= a[j]&b[i - j];
    }
  }
  
  for (i = 0; i < ${size-1}; i++) {
    e[i] = a[i+1]&b[${size - 1}];
    for (j = i + 2;  j < ${size}; j++) {
      e[i] ^= a[j]&b[${size} - j + i];
    }
  }`;

  return result += '\r\n\r\n';
};

function generateResultVectorCalculation(preparedMatrix, size) {
  let result = '';
  result += `\tunsigned int c[${size}];\r\n`;
  for (let i = 0; i < size; i++) {
    result += `\tc[${i}] = (d[${i}]`;
    preparedMatrix[i].forEach(position => result += `^e[${position}]`);
    result += `)${i === 0 ? '' : ` << ${i}`};\r\n`;
  }
  return result += '\r\n';
};

function generateMultiplicationResult(size) {
  let result = '\tunsigned int C = ';
  for (let i = 0; i < size; i++) {
    result += `c[${i}]${i !== size - 1 ? '^' : ';\r\n'}`;
  }

  result += `\tprintf("%d\\r\\n", C);
  return C;
}`;

  return result += '\r\n';
};

module.exports = generateCode;

const BigInt = require('big-integer');

const generateCode = function(Q, size) {
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
  // result += `package com.autogen.generator;\r\n`;
  result += `public class Generator {\r\n`;
  result += `\tpublic static long calculate(long A, long B) {\r\n`;
  return result;
}

function generateSplittingArray(size) {
  let result = '';
  result += `\t\tlong[] arPos = {`
  for (let i = 0; i < size; i++) {
    result += `${BigInt(2).pow(i)}${i < size - 1 ? ', ' : ''}`;
  }
  result += `};\r\n`;
  return result;
}

function generateSplitting(size) {
  let result = '';
  result += `\t\tlong[] a = new long[${size}];\r\n`;
  result += `\t\tlong[] b = new long[${size}];\r\n`;
  result += `\t\tfor (int i = 0; i < ${size}; i++) {\r\n`;
  result += splitter('a');
  result += splitter('b');
  result += `\t\t}\r\n`;
  return result += `\r\n`;
};

function splitter(letter) {
  return `\t\t\t${letter.toLowerCase()}[i] = (${letter.toUpperCase()} & arPos[i]) >> i;\r\n`;
};

function generateTeplitsMatricesBuilding(size) {
  let result = '';
  result += `\t\tlong[] d = new long[${size}];\r\n`;
  result += `\t\tlong[] e = new long[${size - 1}];\r\n`;

  result += `\t\tfor (int i = 0; i < ${size}; i++) {\r\n`;
  result += `\t\t\td[i] = a[0]&b[i];\r\n`;
  result += `\t\t\tfor (int j = 1; j <= i; j++) {\r\n`;
  result += `\t\t\t\td[i] ^= a[j]&b[i - j];\r\n`;
  result += `\t\t\t}\r\n`;
  result += `\t\t}\r\n`;

  result += `\t\tfor (int i = 0; i < ${size - 1}; i++) {\r\n`;
  result += `\t\t\te[i] = a[i + 1]&b[${size - 1}];\r\n`;
  result += `\t\t\tfor (int j = i + 2;  j < ${size}; j++) {\r\n`;
  result += `\t\t\t\te[i] ^= a[j]&b[${size} - j + i];\r\n`;
  result += `\t\t\t}\r\n`;
  result += `\t\t}\r\n`;

  return result += '\r\n';
}

function generateResultVectorCalculation(preparedMatrix, size) {
  let result = '';
  result += `\t\tlong[] c = new long[${size}];\r\n`;
  for (let i = 0; i < size; i++) {
    result += `\t\tc[${i}] = (d[${i}]`;
    preparedMatrix[i].forEach(position => result += `^e[${position}]`);
    result += `)${i === 0 ? '' : ` << ${i}`};\r\n`;
  }
  return result += '\r\n';
}

function generateMultiplicationResult(size) {
  let result = '';
  result += '\t\tlong C = ';
  for (let i = 0; i < size; i++) {
    result += `c[${i}]${i !== size - 1 ? '^' : ';\r\n'}`;
  }

  result += `\t\tSystem.out.println(Long.toString(C,2));\r\n`
  result += `\t\treturn C;\r\n`
  result += `\t}\r\n`;
  result += `}`;

  return result += '\r\n';
}

module.exports = generateCode;

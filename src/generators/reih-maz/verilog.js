const BigInt = require('big-integer');

const generateCode = function(Q, size) {
  let result = '';
  result += generateStatic(size - 1);
  result += generateTeplitsMatricesBuilding(size);
  result += generateResultVectorCalculation(Q, size);
  result += generateMultiplicationResult(size);
  return result;
};

function generateStatic(size) {
  let result = '';
  result += `module GF${size + 1}_MULT (\r\n`;
  result += `\tinput [${size}:0] A,\r\n`;
  result += `\tinput [${size}:0] B,\r\n`;
  result += `\toutput [${size}:0] C\r\n`;
  result += `\t);\r\n`;
  result += `\r\n`;
  result += `\twire [${size}:0] d;\r\n`;
  result += `\twire [${size - 1}:0] e;\r\n`;
  result += `\r\n`;
  return result;
};

function generateTeplitsMatricesBuilding(size) {
  let result = '';
  for (let i = 0; i < size; i++) {
    result += `\tassign d[${i}]\t=\t`;
    for (let j = 0; j <= i; j++) {
      result += `(A[${i - j}] & B[${j}])${i === j ? ';\r\n' : ' ^ '}`;
    }
  };
  result += `\r\n`;
  size = size - 1;
  for (let i = 0; i < size; i++) {
    result += `\tassign e[${i}]\t=\t`;
    for (let j = 0; j <= size - 1 - i; j++) {
      result += `(A[${size - j}] & B[${j + i + 1}])${i === size - 1 - j ? ';\r\n' : ' ^ '}`;
    }
  }

  return result += '\r\n';
};


function generateResultVectorCalculation(preparedMatrix, size) {
  let result = '';
  for (let i = 0; i < size; i++) {
    result += `\tassign C[${i}] = d[${i}]`;
    preparedMatrix[i].forEach(position => result += ` ^ e[${position}]`);
    result += `;\r\n`;
  }
  return result += '\r\n';
};

function generateMultiplicationResult(size) {
  let result = 'endmodule';
  return result += '\r\n';
};

module.exports = generateCode;

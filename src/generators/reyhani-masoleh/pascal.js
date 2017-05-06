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
  let result = '';
  result += 'program GFMultiplier;\r\n';
  result += '\r\n';
  result += 'function calculate(vect_A, vect_B: uint64): uint64;\r\n';
  result += 'begin\r\n';
  return result;
};

function generateSplittingArray(size) {
  let result = '';
  result += `\tvar arPos: array [0..${size-1}] of uint64 := (`;
  for (let i = 0; i < size; i++) {
    result += `${BigInt(2).pow(i)}${i < size - 1 ? ', ' : ''}`;
  }
  result += `);\r\n`;
  result += `\tvar a: array [0..${size-1}] of byte;\r\n`;
  result += `\tvar b: array [0..${size-1}] of byte;\r\n`;
  return result;
};

function generateSplitting(size) {
  let result = `\tfor var i := 0 to ${size-1} do\r\n`;
  result += `\tbegin\r\n`;
  result += splitter('a');
  result += splitter('b');
  result += `\tend;\r\n`;
  return result += `\r\n`
};

function splitter(letter) {
  return `\t\t${letter.toLowerCase()}[i] := (vect_${letter.toUpperCase()} and arPos[i]) shr i;\r\n`;
};

function generateTeplitsMatricesBuilding(size) {
  let result = '';
  result += `\tvar d: array [0..${size-1}] of byte;\r\n`;
  result += `\tvar e: array [0..${size-2}] of byte;\r\n`;
  result += `\r\n`;

  result += `\tfor var i := 0 to ${size-1} do\r\n`;
  result += `\tbegin\r\n`;
  result += `\t\td[i] := a[0] and b[i];\r\n`;
  result += `\t\tfor var j := 1 to i do\r\n`;
  result += `\t\t\td[i] := d[i] xor (a[j] and b[i - j]);\r\n`;
  result += `\tend;\r\n`;

  result += `\tfor var i := 0 to ${size-2} do \r\n`;
  result += `\tbegin\r\n`;
  result += `\t\te[i] := a[i + 1] and b[${size-1}];\r\n`;
  result += `\t\tfor var j := i + 2 to ${size-1} do\r\n`;
  result += `\t\t\te[i] := e[i] xor (a[j] and b[${size} - j + i]);\r\n`;
  result += `\tend;\r\n`;

  return result += '\r\n';
};

function generateResultVectorCalculation(preparedMatrix, size) {
  let result = '';
  result += `\tvar c: array [0..${size-1}] of uint64;\r\n`;
  for (let i = 0; i < size; i++) {
    result += `\tc[${i}] := (d[${i}]`;
    preparedMatrix[i].forEach(position => result += ` xor e[${position}]`);
    result += `)${i === 0 ? '' : ` shl ${i}`};\r\n`;
  }
  return result += '\r\n';
};

function generateMultiplicationResult(size) {
  let result = '';

  result += '\tResult := ';
  for (let i = 0; i < size; i++) {
    result += `c[${i}]${i !== size - 1 ? ' xor ' : ';\r\n'}`;
  }

  result += `\twriteln(Result);\r\n`
  result += `end;\r\n`;
  result += `\r\n`;
  result += `begin\r\n`;
  result += `\tcalculate(41, 37);\r\n`;
  result += `end.`;
  return result += '\r\n';
};

module.exports = generateCode;

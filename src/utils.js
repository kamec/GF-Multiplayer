  module.exports.createMatrix = function createMatrix(size) {
    return new Array(size).fill(0).map(el => new Array(size).fill(0));
  };

  module.exports.prepareMatrix = function prepareMatrix(M) {
    return this.transposeMatrix(M).map(V => V.map((el, idx) => ({ el: el, idx: idx })).filter(cell => cell.el !== 0).map(cell => cell.idx));
  };

  module.exports.multiplyMatrixByVector = function multiplyMatrixByVector(matrix, vector) {
    return matrix.map(row => this.multiplyVectorByVector(row, vector));
  };

  module.exports.multiplyVectorByVector = function multiplyVectorByVector(V1, V2) {
    return V1.reduce((prev, curr, idx) => prev ^ (curr & V2[idx]), 0);
  };

  module.exports.transposeMatrix = function transposeMatrix(M) {
    return M[0].map((col, i) => M.map((row) => row[i]));
  };

  module.exports.xorVectors = function xorVectors(V1, V2) {
    return V1.map((el, idx) => el ^ V2[idx]);
  };

  module.exports.stringifyMatrix = function stringifyMatrix(M) {
    return M.map(row => row.join(' ')).join('\n');
  };

  module.exports.stringifyVector = function stringifyVector(V) {
    return V.join(' ');
  };

  module.exports.getStatus = function getStatus(Q = [[]], A = [], B = [], matrixL = [[]], matrixU = [[]], d = [], e = [], c = []) {
    let status = `Q =\r\n`;
    status += `${this.stringifyMatrix(Q)}\r\n`;
    status += `\r\n`;
    status += `A = ${this.stringifyVector(A)}\r\n`;
    status += `B = ${this.stringifyVector(B)}\r\n`;
    status += `\r\n`;
    status += `L =\r\n`;
    status += `${this.stringifyMatrix(matrixL)}\r\n`;
    status += `\r\n`;
    status += `U =\r\n`;
    status += `${this.stringifyMatrix(matrixU)}\r\n`;
    status += `\r\n`;
    status += `d = ${this.stringifyVector(d)}\r\n`;
    status += `e = ${this.stringifyVector(e)}\r\n`;
    status += `\r\n`;
    status += `C = ${this.stringifyVector(c)}\r\n`;
    status += `\r\n`;
    return status;
  };

const utils = {
  createMatrix: function(size) {
    // return new Array(size).fill(0).map(el => new Array(size).fill('-'));
    return new Array(size).fill(0).map(el => new Array(size).fill(0));
  },

  multiplyMatrixByVector: function(matrix, vector) {
    return matrix.map(row => this.multiplyVectorByVector(row, vector));
  },

  multiplyVectorByVector: function(V1, V2) {
    return V1.reduce((prev, curr, idx) => prev ^ (curr & V2[idx]), 0);
  },

  transposeMatrix: function(M) {
    return M[0].map((col, i) => M.map((row) => row[i]));
  },

  xorVectors: function(V1, V2) {
    return V1.map((el, idx) => el ^ V2[idx]);
  },

  stringifyMatrix: function(M) {
    return M.map(row => row.join(' ')).join('\n');
  },

  stringifyVector: function(V) {
    return V.join(' ');
  },

  getStatus: function(Q = [[]], A = [], B = [], matrixL = [[]], matrixU = [[]], d = [], e = [], c = []) {
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
  },
};

module.exports = utils;

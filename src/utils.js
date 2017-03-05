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

  printMatrix: function(M) {
    console.log(M.map(row => row.join(' ')).join('\n'));
  },

  printVector: function(V) {
    console.log(V.join(' '));
  },

  printStatus: function(Q = [[]], A = [], B = [], matrixL = [[]], matrixU = [[]], d = [], e = [], c = []) {
    console.log('*****************************************************************');
    console.log('Q');
    this.printMatrix(Q);
    console.log();
    console.log('A, B');
    this.printVector(A);
    this.printVector(B);
    console.log();
    console.log('L');
    this.printMatrix(matrixL);
    console.log();
    console.log('U');
    this.printMatrix(matrixU);
    console.log();
    console.log('d,e');
    this.printVector(d);
    this.printVector(e);
    console.log();
    console.log('C');
    this.printVector(c);
  },
};

module.exports = utils;

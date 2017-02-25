const multiplier = {

  _MATRIX_SIZE: 0,

  setMatrixSize: function(size) {
    this._MATRIX_SIZE = size;
  },

  getMatrixSIze: function() {
    return this._MATRIX_SIZE;
  },

  main: function(a, b, p) {
    this._MATRIX_SIZE = p.length - 1;
    const Q = this.initReductionMatrix(p);

    const A = this.splitIntoPowers(a);
    const B = this.splitIntoPowers(b);
    const {matrixL, matrixU} = this.buildTeplitsMatrices(A);

    const d = this.multiplyMatrixByVector(matrixL, B);
    const e = this.multiplyMatrixByVector(matrixU, B);

    const V2 = this.multiplyMatrixByVector(this.transposeMatrix(Q), e);
    const c = this.xorVectors(d, V2);

    this.printStatus(Q, A, B, matrixL, matrixU, d, e, c);
  },

  initReductionMatrix: function(p) {
    const meaningfulPowers = p.split('').reverse().map((el, idx) => ({el: parseInt(el), index: idx})).filter(el => el.el === 1);

    return this.buildReductionMatrix({
      m: meaningfulPowers.pop().index,
      k: meaningfulPowers.map(el => el.index)
    });
  },

  buildReductionMatrix: function({m: m, k: k}) {
    const s = this.calculateDiff(m, k);
    // console.log(m, k.join(' '), s);
    return Number.isInteger(s) ? this.buildReductionMatrixForESP(m, s) : this.buildGenericReductionMatrix(m, k);
  },

  calculateDiff: function(m, k) {
    const powers = [].concat(k);
    powers.push(m);
    let s = Math.abs(powers[0] - powers[1]);
    for (let i = 1; i < powers.length - 1; i++) {
      const diff = Math.abs(powers[i] - powers[i + 1]);
      if (diff === s) {
        continue;
      }
      return s / diff;
    }

    return s;
  },

  buildReductionMatrixForESP: function(m, s) {
    const Q = this.createMatrix(m);
    Q.pop();
    for (let row = 0; row < Q.length; row++) {
      for (let col = 0; col < Q[0].length; col++) {
        if (row < s && (col - row) % s === 0 || row >= s && row - col === s) {
          Q[row][col] = Q[row][col] ^ 1;
        }
      }
    }
    return Q;
  },

  buildGenericReductionMatrix: function(m, k) { //TODO: fix conditions
    const Q = this.createMatrix(m);
    Q.pop();
    for (let y = 0; y < Q.length; y++) {
      for (let x = 0; x < Q[0].length; x++) {
        k.forEach(basis => {
          k.forEach(kX => {
            if ((y - x) % (m - kX) === 0 && y > x && x + basis < Q[0].length) {
              // Q[y][(x + basis) % m] = Number.isInteger(Q[y][(x + basis) % m]) ? Q[y][(x + basis) % m] ^ 1 : 1;
              Q[y][(x + basis) % m] = Q[y][(x + basis) % m] ^ 1;
            }
          });
          if ((x - y) === 0 && x - y >= 0 && x + basis < Q[0].length) {
            // Q[y][(x + basis) % m] = Number.isInteger(Q[y][(x + basis) % m]) ? Q[y][(x + basis) % m] ^ 1 : 1;
            Q[y][(x + basis) % m] = Q[y][(x + basis) % m] ^ 1;
          }
        });
      }
    }

    return Q;
  },

  splitIntoPowers: function(poly) {
    return poly.split('').reverse().map(el => parseInt(el, 2)).concat(new Array(this._MATRIX_SIZE - poly.length).fill(0));
  },

  buildTeplitsMatrices: function(powers) {
    const matrixL = this.createMatrix(this._MATRIX_SIZE);
    const matrixU = this.createMatrix(this._MATRIX_SIZE);

    for (let row = 0; row < this._MATRIX_SIZE; row++) {
      for (let col = 0; col < this._MATRIX_SIZE; col++) {
        if (row >= col) {
          matrixL[row][col] = powers[row - col] || 0;
        } else {
          matrixU[row][col] = powers[this._MATRIX_SIZE - col + row] || 0;
        }
      }
    }
    matrixU.pop();
    return {matrixL, matrixU};
  },

  createMatrix: function(m) {
    // return new Array(m).fill(0).map(el => new Array(m).fill('-'));
    return new Array(m).fill(0).map(el => new Array(m).fill(0));
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
    this.printMatrix(Q);
    console.log();
    this.printVector(A);
    this.printVector(B);
    console.log();
    this.printMatrix(matrixL);
    console.log();
    this.printMatrix(matrixU);
    console.log();
    this.printVector(d);
    console.log();
    this.printVector(e);
    console.log();
    console.log();
    this.printVector(c);
  }
};

module.exports = multiplier;
// main('101111', '111101', '111111111111111111111111111111111'); // ESP
// main('101111', '111101', '1000000000010000000000100000000001'); // ESP
// main('101111', '111101', '100000000000000010000000000000001'); // ESP
// main('101111', '111101', '100000000000000000000000000000011'); //Trinom
// main('101111', '111101', '100000000000000000010000000000001'); //Trinom
// main('101111', '111101', '100000000100000000000000000000001'); //Trinom
// main('101111', '111101', '101000000000000000000000000000001'); //Trinom
// main('101111', '111101', '110000000000000000000000000000001'); //Trinom
// main('101111', '111101', '100000000000000000010010001000001'); //Pentanom
// multiplier.main('100101', '101001', '1000011'); //Trinom

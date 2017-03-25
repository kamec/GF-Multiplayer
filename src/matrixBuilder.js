const utils = require('./utils');

const matrixBuilder = {
  main: function(a, b, p) {
    MATRIX_SIZE = p.length - 1;
    const Q = this.initReductionMatrix(p);

    const A = this.splitIntoPowers(a, MATRIX_SIZE);
    const B = this.splitIntoPowers(b, MATRIX_SIZE);
    const {matrixL, matrixU} = this.buildTeplitsMatrices(A, MATRIX_SIZE);

    const d = utils.multiplyMatrixByVector(matrixL, B);
    const e = utils.multiplyMatrixByVector(matrixU, B);

    const V2 = utils.multiplyMatrixByVector(utils.transposeMatrix(Q), e);
    const c = utils.xorVectors(d, V2);

    const status = utils.getStatus(Q, A, B, matrixL, matrixU, d, e, c);
    console.log(status);
  },

  initReductionMatrix: function(p) {
    const meaningfulPowers = Array.from(p).reverse().map((el, idx) => el === '1' ? idx : el).filter(el => el !== '0');
    return (meaningfulPowers.indexOf(0) === -1) ? [] : this.buildReductionMatrix(meaningfulPowers.pop(), meaningfulPowers);
  },

  buildReductionMatrix: function(m, k) {
    const s = this.calculateDiff(m, k);
    if (Number.isInteger(s)) {
      return this.buildReductionMatrixForESP(m, s);
    }
    if (k.length === 2 || k.length === 4) {
      return this.buildGenericReductionMatrix(m, k);
    }
    return [];
  },

  calculateDiff: function(m, k) {
    const powers = [].concat(k).concat(m);
    let s = Math.abs(powers[0] - powers[1]);
    for (let i = 1; i < powers.length - 1; i++) {
      const diff = Math.abs(powers[i] - powers[i + 1]);
      if (diff !== s) {
        return Math.PI;
      }
    }
    return s;
  },

  buildReductionMatrixForESP: function(m, s) {
    const Q = utils.createMatrix(m);
    Q.pop();
    for (let row = 0; row < Q.length; row++) {
      for (let col = 0; col < Q[0].length; col++) {
        if (row < s && (col - row) % s === 0 || row >= s && row - col === s) {
          Q[row][col] = Q[row][col] ^ 1;
          // Q[row][col] = Number.isInteger(Q[row][col])? '-' : 1;
        }
      }
    }
    return Q;
  },

  buildGenericReductionMatrix: function(m, k) {
    const Q = utils.createMatrix(m);
    Q.pop();
    k.push(m);
    k.forEach(ki => k.forEach(kj => {
      let r = m - kj;
      do {
        this.drawDiagonal(ki, r, Q);
        r += m - kj;
      } while (r < m - 1 && kj !== m);
    }));
    return Q;
  },

  drawDiagonal(col, row, M) {
    for (let i = 0; row + i < M.length && col + i < M[0].length; i++) {
      M[row + i][col + i] = M[row + i][col + i] ^ 1;
      // M[row + i][col + i] = Number.isInteger(M[row + i][col + i]) ? '-' : 1;
      // M[row + i][col + i] = Number.isInteger(M[row + i][col + i]) ? M[row + i][col + i] ^ 1 : 1;
    }
  },

  splitIntoPowers: function(poly, size) {
    return Array.from(poly).reverse().map(el => parseInt(el, 2)).concat(new Array(size - poly.length).fill(0));
  },

  buildTeplitsMatrices: function(powers, size) {
    const matrixL = utils.createMatrix(size);
    const matrixU = utils.createMatrix(size);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (row >= col) {
          matrixL[row][col] = powers[row - col] || 0;
        } else {
          matrixU[row][col] = powers[size - col + row] || 0;
        }
      }
    }
    matrixU.pop();
    return {matrixL, matrixU};
  }
};

// matrixBuilder.main('1101000010111010', '1010111101000001', '111111111111111111111111111111111'); // ESP
// matrixBuilder.main('1101000010111010', '1010111101000001', '101010101010101010101010101010101'); // ESP
// matrixBuilder.main('1101000010111010', '1010111101000001', '100010001000100010001000100010001'); // ESP
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000001000000010000000100000001'); // ESP
// matrixBuilder.main('1101000010111010', '1010111101000001', '1000000000010000000000100000000001'); // ESP
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000000000000010000000000000001'); // ESP
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000000000000000000000000000011'); //Trinom
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000000000000000000000000000101'); //Trinom
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000000000000000010000000000001'); //Trinom
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000000100000000000000000000001'); //Trinom
// matrixBuilder.main('1101000010111010', '1010111101000001', '101000000000000000000000000000001'); //Trinom
// matrixBuilder.main('1101000010111010', '1010111101000001', '110000000000000000000000000000001'); //Trinom
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000000000000000001001000100001'); //Pentanom
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000000100000000100000000100001'); //Pentanom
// matrixBuilder.main('1101000010111010', '1010111101000001', '100000010000001000000100000000001'); //Pentanom
// matrixBuilder.main('100101', '111010', '1000011'); //Trinom
// matrixBuilder.main('100101', '111010', '1100001'); //Trinom
// matrixBuilder.main('100101', '111010', '1111111'); //ESP
module.exports = matrixBuilder;

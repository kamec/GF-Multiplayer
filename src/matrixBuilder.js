const utils = require('./utils');

module.exports.main = function(a, b, p) {
  MATRIX_SIZE = p.length - 1;
  const Q = this.initReductionMatrix(p);

  const A = splitIntoPowers(a, MATRIX_SIZE);
  const B = splitIntoPowers(b, MATRIX_SIZE);
  const { matrixL, matrixU } = buildTeplitsMatrices(A, MATRIX_SIZE);

  const d = utils.multiplyMatrixByVector(matrixL, B);
  const e = utils.multiplyMatrixByVector(matrixU, B);

  const V2 = utils.multiplyMatrixByVector(utils.transposeMatrix(Q), e);
  const c = utils.xorVectors(d, V2);

  const status = utils.getStatus(Q, A, B, matrixL, matrixU, d, e, c);
  return status;
};

module.exports.initReductionMatrix = function(p) {
  const meaningfulPowers = Array.from(p).reverse().map((el, idx) => el === '1' ? idx : el).filter(el => el !== '0');
  return (meaningfulPowers.indexOf(0) === -1) ? [] : buildReductionMatrix(meaningfulPowers.pop(), meaningfulPowers);
};

function buildReductionMatrix(m, k) {
  const s = calculateDiff(m, k);
  if (Number.isInteger(s)) {
    return buildReductionMatrixForESP(m, s);
  }
  if (k.length === 2 || k.length === 4) {
    return buildGenericReductionMatrix(m, k);
  }
  return [];
};

function calculateDiff(m, k) {
  const powers = [].concat(k).concat(m);
  let s = Math.abs(powers[0] - powers[1]);
  for (let i = 1; i < powers.length - 1; i++) {
    const diff = Math.abs(powers[i] - powers[i + 1]);
    if (diff !== s) {
      return Math.PI;
    }
  }
  return s;
};

function buildReductionMatrixForESP(m, s) {
  const Q = utils.createMatrix(m);
  Q.pop();
  for (let row = 0; row < Q.length; row++) {
    for (let col = 0; col < Q[0].length; col++) {
      if (row < s && (col - row) % s === 0 || row >= s && row - col === s) {
        Q[row][col] = Q[row][col] ^ 1;
      }
    }
  }
  return Q;
};

 function buildGenericReductionMatrix(m, k) {
  const Q = utils.createMatrix(m);
  Q.pop();
  k.push(m);
  k.forEach(ki => k.forEach(kj => {
    let r = m - kj;
    do {
      drawDiagonal(ki, r, Q);
      r += m - kj;
    } while (r < m - 1 && kj !== m);
  }));
  return Q;
};

function drawDiagonal(col, row, M) {
  for (let i = 0; row + i < M.length && col + i < M[0].length; i++) {
    M[row + i][col + i] = M[row + i][col + i] ^ 1;
  }
};

function splitIntoPowers(poly, size) {
  return Array.from(poly).reverse().map(el => parseInt(el, 2)).concat(new Array(size - poly.length).fill(0));
};

function buildTeplitsMatrices(powers, size) {
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
  return { matrixL, matrixU };
};

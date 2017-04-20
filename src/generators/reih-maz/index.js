const utils = require('../../utils');

const E_WRONG_TYPE = 'Invalid polynomial basis type.\r\n\tOnly ESP, trinomials and pentanomials are supported.';
const E_WRONG_LANG = 'Invalid language.\r\n\tCheck supported section.';

module.exports = function(p, language) {
  const Q = initReductionMatrix(p);

  if (Q.length === 0) {
    throw new Error(E_WRONG_TYPE);
  }

  const size = Q[0].length;
  let module;
  try {
    module = require(`./${language}.js`);
  } catch (err) {
    throw new Error(E_WRONG_LANG);
  }
  
  return language === 'matrix'? module(utils.stringifyMatrix(Q)) : module(utils.prepareMatrix(Q), size);
}

function initReductionMatrix(p) {
  const meaningfulPowers = Array.from(p).reverse().map((el, idx) => el === '1' ? idx : el).filter(el => el !== '0');
  return (meaningfulPowers.indexOf(0) === -1) ? [] : buildReductionMatrix(meaningfulPowers);
};

function buildReductionMatrix(powers) {
  const s = calculateDiff(powers);
  if (Number.isInteger(s)) {
    return buildReductionMatrixForESP(powers.pop(), s);
  }
  if (powers.length === 3 || powers.length === 5) {
    return buildGenericReductionMatrix(powers);
  }
  return [];
};

function calculateDiff(powers) {
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

function buildGenericReductionMatrix(k) {
  const m = k[k.length - 1];
  const Q = utils.createMatrix(m);
  Q.pop();
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

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
    return M.map(row => row.join(' ')).join('\r\n');
  };

  module.exports.stringifyVector = function stringifyVector(V) {
    return V.join(' ');
  };

  module.exports.resolveFilename = function(lang, name) {
    return (lang === 'java') ? 'GFMultiplier.java' : `${name || 'out'}.${resolveExtension(lang)}`;
  };

  function resolveExtension(lang) {
    const extensions = {
      c_def: 'c',
      c_func: 'c',
      pascal: 'pas',
      python: 'py',
      verilog: 'v',
    };

    return extensions[lang] || 'txt';
  }

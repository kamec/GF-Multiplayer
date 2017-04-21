const utils = require('../../utils');

const E_WRONG_TYPE = 'Invalid polynomial basis type.';
const E_WRONG_LANG = 'Invalid language.\r\n\tCheck supported section.';

module.exports = function(p, language) {
  // if (!p.match(/^1[01]+1$/)) {
  //   throw new Error(E_WRONG_TYPE);
  // }

  let module;
  try {
    module = require(`./${language}.js`);
  } catch (err) {
    throw new Error(E_WRONG_LANG);
  }

  // REVIEW: Replace with correct input
  const arr = p.split('.');
  return '' + module(arr[0], arr[1], arr[2]);
}

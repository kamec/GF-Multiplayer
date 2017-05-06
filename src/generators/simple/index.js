const utils = require('../../utils');

const E_WRONG_TYPE = 'Invalid polynomial basis type.';
const E_WRONG_LANG = 'Invalid language.\r\n\tCheck supported section.';

module.exports = function(p, language) {
  if (!p.match(/^1[01]+$/)) {
    throw new Error(E_WRONG_TYPE);
  }

  try {
    return require(`./${language}.js`)(p);
  } catch (err) {
    throw new Error(E_WRONG_LANG);
  }
}

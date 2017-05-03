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

  const arr = p.split('.');
  if (language === 'javas_bin') {
    const P = parseInt(p, 2);
    let result = (module(parseInt(reverse(arr[1]), 2), parseInt(reverse(arr[2]), 2), 0));
    console.log(result);
    return modulo(result, P).toString(2);
  }
  if (language === 'javas_dec') {
    return '' + module(parseInt(arr[0], 2), parseInt(arr[1], 2));
  }

  return module(p);
}

function reverse(x) {
  return Array.from(x).reverse().join('');
}

function modulo(a, b) {
  while (a.toString(2).length >= b.toString(2).length) {
    a = a ^ equalize(a, b);
  }
  return a;
}

function equalize(a, b) {
  const A = a.toString(2).length;
  const B = b.toString(2).length;
  if (A > B) {
    b = b << (A - B);
  }
  return b;
}

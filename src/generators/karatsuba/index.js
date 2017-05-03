const utils = require('../../utils');

const E_WRONG_TYPE = 'Invalid polynomial basis type.';
const E_WRONG_LANG = 'Invalid language.\r\n\tCheck supported section.';

module.exports = function(p, language) {
  if (p.match(/^1[01]+1$/)) {
    throw new Error(E_WRONG_TYPE);
  }

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
    return truncate(result, P).toString(2);
  }
  if (language === 'javas') {
    return '' + module(parseInt(arr[0], 2), parseInt(arr[1], 2));
  }

  return module(p);

}

function reverse(x) {
  return Array.from(x).reverse().join('');
}

function truncate(a, b) {
  console.log(`*********************************\r\n${a.toString(2)} mod ${b.toString(2)}`);
  while (a.toString(2).length >= b.toString(2).length) {
    a = a ^ longate(a, b);
    console.log(`*********************************\r\n${a.toString(2)} mod ${b.toString(2)}`);
  }
  return a;
}

function longate(a, b) {
  const A = a.toString(2);
  const B = b.toString(2);
  if (A.length > B.length) {
    b = b << (A.length - B.length);
  }
  return b;
}

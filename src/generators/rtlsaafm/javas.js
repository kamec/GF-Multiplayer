module.exports = function doWork(p, a, b) {
  if (a.length >= p.length || b.length >= p.length) {
    throw new Error('Wrong args length.');
  }
  a = reverse(a);
  b = reverse(b);
  p = parseInt(reverse(p), 2);
  return performCalc(parseInt(a, 2), parseInt(b, 2), a.length);

  function performCalc(x, y, n) {
    let c = (x & 1 === 1) ? y : 0;
    for (let i = 1; i < n; i++) {
      y = y << 1;
      if (y >= p) {
        y = y ^ p;
      }
      if (x >> i & 1 === 1) {
        c = c ^ y;
      }
    }
    return c;
  }

  function reverse(x) {
    return Array.from(x).reverse().join('');
  }
}
//11001.1010.0110

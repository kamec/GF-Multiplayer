module.exports = function doWork(p, a, b) {
  if (a.length >= p.length || b.length >= p.length) {
    throw new Error('Wrong args length.');
  }
  const m = Math.pow(2, p.length - 1); 
  p = parseInt(reverse(p), 2);
  a = reverse(a);
  b = reverse(b);
  return performCalc(parseInt(a, 2), parseInt(b, 2), a.length);

  function performCalc(A, B, n) {
    let C = (A & 1 === 1) ? B : 0;
    console.log(A.toString(2), B.toString(2), n, C.toString(2));
    while (A > 0) {
      B = B << 1;
      console.log('shift B', B.toString(2));
      if (B >= m) {
        B = B ^ p;
        console.log('B mod p', B.toString(2));
      }
      A = A >> 1;
      console.log('A', A.toString(2));
      if (A & 1 === 1) {
        C = C ^ B;
        console.log('C', C.toString(2));
      }
    }
    return C//.toString(2);
  }

  function reverse(x) {
    return Array.from(x).reverse().join('');
  }
}
//11001.1010.0110
//1010101.100101.101001
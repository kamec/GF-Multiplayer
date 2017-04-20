module.exports = function karatsubaMulti(A, B) {
  const n = Math.min(('' + A).length, ('' + B).length);
  console.log(A, B, n);
  if (n == 1) {
    return A * B;
  }
  const halfPow = Math.pow(10, Math.floor(n / 2));
  const fullPow = Math.pow(10, 2 * Math.floor(n / 2));
  console.log(halfPow, fullPow);
  const AH = Math.floor(A / halfPow);
  const AL = A % halfPow;
  const BH = Math.floor(B / halfPow);
  const BL = B % halfPow;
  return fullPow * karatsubaMulti(AH, BH) + halfPow * (karatsubaMulti(AH, BL) + karatsubaMulti(AL, BH)) + karatsubaMulti(AL, BL);
}
//00100010.01001110

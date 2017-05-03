module.exports = function karatsubaMulti(A, B) {
  const n = Math.min(('' + A).length, ('' + B).length);
  console.log(A, B, n);
  if (n === 1) {
    return A * B;
  }
  const halfPow = Math.pow(10, Math.floor(n / 2));
  const fullPow = Math.pow(10, 2 * Math.floor(n / 2));

  const AH = Math.floor(A / halfPow);
  const AL = A % halfPow;
  const BH = Math.floor(B / halfPow);
  const BL = B % halfPow;

  const MH = karatsubaMulti(AH, BH);
  const MM = karatsubaMulti(AH + AL, BH + BL);
  const ML = karatsubaMulti(AL, BL);

  return fullPow * MH + halfPow * (MM - MH - ML) + ML;
}
//00100010.01001110

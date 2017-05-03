//00100010.01001110
//1010101.100101.101001


module.exports = function calc(p, A, B) {
  const P = parseInt(p, 2);
  let result = (karatsubaMulti(parseInt(reverse(A), 2), parseInt(reverse(B), 2)));
  return modulo(result, P).toString(2);
} 

function karatsubaMulti(A, B) {
  const n = Math.max((A.toString(2)).length, (B.toString(2)).length);
  if (n === 1) {
    return A & B;
  }
  const half = Math.ceil(n / 2);
  const full = 2 * half;
  const filterHalf = (2 << half - 1) - 1;

  const AH = A >> half;
  const AL = A & filterHalf;
  const BH = B >> half;
  const BL = B & filterHalf;

  const MH = karatsubaMulti(AH, BH);
  const ML = karatsubaMulti(AL, BL);
  const MM = karatsubaMulti(AH ^ AL, BH ^ BL) ^ MH ^ ML;

  return MH << full ^ MM << half ^ ML;
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
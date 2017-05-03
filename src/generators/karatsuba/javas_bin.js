//00100010.01001110
//1010101.100101.101001

module.exports = function karatsubaMulti(A, B, step) {
  const n = Math.max((A.toString(2)).length, (B.toString(2)).length);
  console.log('');
  console.log(`${step})`, 'A:', A.toString(2), 'B:', B.toString(2), n);
  if (n === 1) {
    console.log(`${step}) result:`, (A & B).toString(2), ' : ', A.toString(2), B.toString(2));
    return A & B;
  }
  const half = Math.ceil(n / 2);
  const full = 2 * half;
  const filterHalf = (2 << half - 1) - 1;

  const AH = A >> half;
  const AL = A & filterHalf;
  const BH = B >> half;
  const BL = B & filterHalf;
  console.log(`${step})`, 'A:', A.toString(2), ': AH:', AH.toString(2), 'AL:', AL.toString(2));
  console.log(`${step})`, 'B:', B.toString(2), ': BH:', BH.toString(2), 'BL:', BL.toString(2));

  const MH = karatsubaMulti(AH, BH, 'MH-' + step);
  const ML = karatsubaMulti(AL, BL, 'ML-' + step);
  const MM = karatsubaMulti(AH ^ AL, BH ^ BL, 'MM-' + step) ^ MH ^ ML;

  console.log('MH:', (MH << full).toString(2));
  console.log('MM:', (MM << half).toString(2));
  console.log('ML:', (ML).toString(2));
  console.log(`${step}) result:`, (MH << full ^ MM << half ^ ML).toString(2));
  return MH << full ^ MM << half ^ ML;
}

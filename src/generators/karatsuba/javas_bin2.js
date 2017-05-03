//00100010.01001110
//1010101.100101.101001

module.exports = (A, B, p) => {
  return Kmul2k(p.length - 1, A, B);
}

function Kmul2k(m, A, B) {
  const k = binaryFactrization(m).binPow;
  console.log(binaryFactrization(m), A.toString(2), B.toString(2));
  if (k === 0) {
    let C = A & B;
    console.log(C.toString(2));
    return C;
  }
  const r = 1 << k;
  const border = r / 2;
  const shiftHalf = m / 2;
  const filterLow = Math.pow(2, m / 2 + 1) - 1;

  let AH = A >> shiftHalf;
  let AL = A & filterLow;
  let BH = B >> shiftHalf;
  let BL = A & filterLow;

  let MA = AH ^ AL;
  let MB = BH ^ BL;

  const CH = Kmul2k(shiftHalf, AH, BH);
  const CM = Kmul2k(shiftHalf, MA, MB);
  const CL = Kmul2k(shiftHalf, AL, BL);

  const M = CM ^ CH ^ CL;

  console.log((CH << m).toString(2), (M << shiftHalf).toString(2), CL.toString(2));
  const C = (CH << m) ^ (M << shiftHalf) ^ (CL);
  console.log(C.toString(2));
  return C;
}

function binaryFactrization(rest) {
  if (rest % 2 !== 0) return ({ binPow: 0, rest });
  let binPow = 0;
  do {
    binPow++;
    rest = rest >> 1;
  } while ((rest & 1) === 0);
  return ({ binPow, rest });
}

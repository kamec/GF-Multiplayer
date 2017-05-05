module.exports = function generateCode(p) {
  let result = `#include <stdio.h>
#include <stdlib.h>
#include <math.h>

unsigned int max(unsigned int A, unsigned int B) {
  if (A >= B) {
    return A;
  }
  return B;
}

unsigned int getBinaryLength(unsigned int n) {
  unsigned int length = 1;
  while (n > 1) {
    length++;
    n = n >> 1;
  }
  return length;
}

unsigned int modulo(unsigned int A, unsigned int B) {
  unsigned int B_len = getBinaryLength(B);
  unsigned int A_len = getBinaryLength(A);
  
  while (A_len >= B_len){
    A = A ^ (B << (A_len - B_len));
    A_len = getBinaryLength(A);
  }
  return A;
}

unsigned int calculate(unsigned int A, unsigned int B) {
  unsigned int n = max(getBinaryLength(A), getBinaryLength(B));
  if (n == 1) {
    return A & B;
  }
  unsigned int half = (unsigned int) ceil(n / 2);
  unsigned int full = 2 * half;
  unsigned int filterHalf = (2 << (half - 1)) - 1;
  
  unsigned int AH = A >> half;
  unsigned int AL = A & filterHalf;
  unsigned int BH = B >> half;
  unsigned int BL = B & filterHalf;

  unsigned int MH = calculate(AH, BH);
  unsigned int ML = calculate(AL, BL);
  unsigned int MM = calculate(AH ^ AL, BH ^ BL) ^ MH ^ ML;
  
  return MH << full ^ MM << half ^ ML;
}

int main(int argc, char *argv[]) {
  char *pCh;
  unsigned int P = strtoul("${p}", &pCh, 2);
  unsigned int A = strtoul(argv[1], &pCh, 2);
  unsigned int B = strtoul(argv[2], &pCh, 2);
  
  unsigned int multiplied = calculate(A, B);
  unsigned int result = modulo(multiplied, P);
  printf("%d\\r\\n", result);
  return result;
}`;
  
  return result;
};

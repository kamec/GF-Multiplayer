module.exports = function generateCode(p) {
  let result = `#include <stdio.h>
#include <stdlib.h>
  
int main(int argc, char *argv[]) {
  unsigned int p = ${parseInt(p, 2)}
  unsigned int m = ${Math.pow(2, p.length - 1)}
  char *pCh;
	unsigned int A = strtoul(argv[1], &pCh, 2);
	unsigned int B = strtoul(argv[2], &pCh, 2);
  unsigned int C = 0;

  while (A > 0) {
    if (A & 1 == 1) {
      C = C ^ B;
    }
    A = A >> 1;
    B = B << 1;
    if (B >= m) {
      B = B ^ p;
    }
  }

  printf("%d\\r\\n", C);
	return C;
}`;
  
  return result;
};

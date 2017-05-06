module.exports = function generateCode(p) {
  let result = `public class GFMultiplier {
    public static long calculate(long A, long B) {
      long P = ${parseInt(p, 2)};
      long M = ${Math.pow(2, p.length - 1)};
      long C = 0;
      
      while (A > 0) {
        if (A & 1 == 1) {
          C = C ^ B;
        }
        A = A >> 1;
        B = B << 1;
        if (B >= M) {
          B = B ^ P;
        }
      }
      
      System.out.println(Long.toString(C, 2));
      return C;
    }
  }`;

  return result;
};

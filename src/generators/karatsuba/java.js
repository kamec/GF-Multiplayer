module.exports = function generateCode(p) {
  let result = `public class GFMultiplier {
    
  public static long karatsuba_mult(long A, long B) {
    long P = Long.parseLong("${p}", 2);
    long result = GFMultiplier.modulo(GFMultiplier.calculate(A, B), P);
    System.out.println(result);
    return result;
  }

  private static long modulo(long A, long B) {
    long B_len = Long.toString(B, 2).length();
    long A_len = Long.toString(A, 2).length();
    
    while (A_len >= B_len){
      A = A ^ (B << (A_len - B_len));
      A_len = Long.toString(A, 2).length();
    }
    return A;
  }

  private static long calculate(long A, long B) {
    long n = Math.max(Long.toString(A, 2).length(), Long.toString(B, 2).length());
    if (n == 1) {
      return A & B;
    }
    long half = (long) Math.ceil(n / 2);
    long full = 2 * half;
    long filterHalf = (2 << half - 1) - 1;
    
    long AH = A >> half;
    long AL = A & filterHalf;
    long BH = B >> half;
    long BL = B & filterHalf;
  
    long MH = GFMultiplier.calculate(AH, BH);
    long ML = GFMultiplier.calculate(AL, BL);
    long MM = GFMultiplier.calculate(AH ^ AL, BH ^ BL) ^ MH ^ ML;
    
    return MH << full ^ MM << half ^ ML;
  }
}`;
  
  return result;
};

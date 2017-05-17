module.exports = function generateCode(p) {
  let result = `class GFMultiplier:
  def karatsuba_mult(self, A: int, B: int):
    P = int('${p}', 2)
    result = self.modulo(self.calculate(A, B), P)
    print('{0:b}'.format(result))
    return result
  
  def modulo(self, a: int, b: int):
    B_len = len('{0:b}'.format(b))
    A_len = len('{0:b}'.format(a))
    while (A_len >= B_len):
      a = a ^ (b << (A_len - B_len))
      A_len = len('{0:b}'.format(a))
    return a

  def calculate(self, A: int, B: int):
    n = max(len('{0:b}'.format(A)), len('{0:b}'.format(B)))
    if n == 1:
      return A & B
    
    from math import ceil
    half = ceil(n / 2)
    full = 2 * half  
    filterHalf = (2 << half - 1) - 1
    
    AH = A >> half
    AL = A & filterHalf
    BH = B >> half
    BL = B & filterHalf
    
    MH = self.calculate(AH, BH)
    ML = self.calculate(AL, BL)
    MM = self.calculate(AH ^ AL, BH ^ BL) ^ MH ^ ML;
    
    return MH << full ^ MM << half ^ ML

if __name__ == '__main__':
  GFMultiplier().karatsuba_mult(int('101001', 2), int('100101', 2))`;
  
  return result;
};

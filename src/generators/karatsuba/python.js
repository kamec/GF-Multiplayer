module.exports = function generateCode(p) {
  let result = `class GFMultiplier:
    def karatsuba_mult(self, A: int, B: int):
      P = int('${p}', 2)
      result = '{0:b}'.format(self.modulo(self.calculate(A, B), P))
      print(result)
      return result
    
    def modulo(self, a: int, b: int):
      while (len('{0:b}'.format(a)) >= len('{0:b}'.format(b))):
        a = a ^ self.equalize(a, b)
      return a
  
    def equalize(self, a: int, b: int):
      A = len('{0:b}'.format(a))
      B = len('{0:b}'.format(b))
      if (A > B):
        b = b << (A - B)
      return b
  
    def calculate(self, A: int, B: int):
      n = max(len('{0:b}'.format(A)), len('{0:b}'.format(B)))
      if n == 1:
        return A & B
      
      from math import ceil
      half = ceil(n /2)
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

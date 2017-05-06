module.exports = function generateCode(p) {
  let result = `class GFMultiplier:
    def calculate(self, A: int, B: int):
      p = ${parseInt(p, 2)}
      m = ${Math.pow(2, p.length - 1)}
      C = 0
      
      while A > 0:
        if A & 1 == 1:
          C = C ^ B
        
        A = A >> 1
        B = B << 1
        if B >= m:
          B = B ^ p
  
      print("{0:b}".format(C))
      return "{0:b}".format(C)
if __name__ == '__main__':
    GFMultiplier().calculate(int('101001', 2), int('100101', 2))`;
  
  return result;
};

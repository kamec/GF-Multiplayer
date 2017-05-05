module.exports = function generateCode(p) {
  let result = `program GFMultiplier;
  
function getBinaryLength(n: uint64): uint64;
begin
  if n < 2 then
    getBinaryLength := 1
  else begin
    var length := 0;
    while n > 0 do begin
      length := length + 1;
      n := n shr 1;
    end;
    getBinaryLength := length;
  end;
end;

function modulo(a, b: uint64): uint64;
begin
  var A_len := getBinaryLength(a);
  var B_len := getBinaryLength(b);
   
  while (A_len >= B_len) do 
  begin
    a := a xor (b shl (A_len - B_len));
    A_len := getBinaryLength(a);
  end;
  modulo := a;
end;

function calculate(A, B: uint64): uint64;
begin
  var n := Max(getBinaryLength(A), getBinaryLength(B));
  if n = 1 then
  begin
    calculate := A and B;
  end
  else begin
    var half := Ceil(n / 2);
    var full := 2 * half;
    var filterHalf := (2 shl (half - 1)) - 1;
      
    var AH := A shr half;
    var AL := A and filterHalf;
    var BH := B shr half;
    var BL := B and filterHalf;
    
    var MH := calculate(AH, BH);
    var ML := calculate(AL, BL);
    var MM := calculate(AH xor AL, BH xor BL) xor MH xor ML;
    
    calculate := MH shl full xor MM shl half xor ML;
  end;
end;

function karatsuba_mult(A, B: uint64): uint64;
begin
  var P := ${parseInt(p, 2)};
  var mult := calculate(A, B);
  karatsuba_mult := modulo(mult, P);
end;

begin
  var result := karatsuba_mult(41, 37);
  writeln(result);
end.`;
  return result;
};

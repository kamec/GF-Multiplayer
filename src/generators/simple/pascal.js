module.exports = function generateCode(p) {
  let result = `program GFMultiplier;
  
function calculate(A, B: uint64): uint64;
begin
  var p := ${parseInt(p, 2)};
  var m := ${Math.pow(2, p.length - 1)};
  var C: uint64 := 0;
  
  while A > 0 do
  begin
    if A and 1 = 1 then
      C := C xor B;
    
    A := A shr 1;
    B := B shl 1;
    if B >= m then
      B := B xor p;
  end;
   
  Result := C;
  writeln(Result);
end;

begin
  calculate(41, 37);
end.`;
  
  return result;
};

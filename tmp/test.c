#include <stdio.h>
#include <stdlib.h>
#define a0	((A&1))
#define a1	((A&2)>>1)
#define a2	((A&4)>>2)
#define a3	((A&8)>>3)
#define a4	((A&16)>>4)
#define a5	((A&32)>>5)

#define b0	((B&1))
#define b1	((B&2)>>1)
#define b2	((B&4)>>2)
#define b3	((B&8)>>3)
#define b4	((B&16)>>4)
#define b5	((B&32)>>5)

#define d0	(a0&b0) 
#define d1	(a1&b0) ^ (a0&b1) 
#define d2	(a2&b0) ^ (a1&b1) ^ (a0&b2) 
#define d3	(a3&b0) ^ (a2&b1) ^ (a1&b2) ^ (a0&b3) 
#define d4	(a4&b0) ^ (a3&b1) ^ (a2&b2) ^ (a1&b3) ^ (a0&b4) 
#define d5	(a5&b0) ^ (a4&b1) ^ (a3&b2) ^ (a2&b3) ^ (a1&b4) ^ (a0&b5) 
#define e0	(a5&b1) ^ (a4&b2) ^ (a3&b3) ^ (a2&b4) ^ (a1&b5) 
#define e1	(a5&b2) ^ (a4&b3) ^ (a3&b4) ^ (a2&b5) 
#define e2	(a5&b3) ^ (a4&b4) ^ (a3&b5) 
#define e3	(a5&b4) ^ (a4&b5) 
#define e4	(a5&b5) 

#define c0	((d0^e0))
#define c1	((d1^e0^e1) << 1)
#define c2	((d2^e1^e2) << 2)
#define c3	((d3^e2^e3) << 3)
#define c4	((d4^e3^e4) << 4)
#define c5	((d5^e4) << 5)

#define cmul (c0^c1^c2^c3^c4^c5)
int main(int argc, char *argv[])
{
	char *pCh;
	unsigned int A = strtoul(argv[1], &pCh, 2);
	unsigned int B = strtoul(argv[2], &pCh, 2);
	unsigned int C;
	C = cmul;
	printf("%d\r\n", C);
	return C;
}

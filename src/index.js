// main('101111', '111101', '111111111111111111111111111111111'); // ESP
// main('101111', '111101', '1000000000010000000000100000000001'); // ESP
// main('101111', '111101', '100000000000000010000000000000001'); // ESP
// main('101111', '111101', '100000000000000000000000000000011'); //Trinom
// main('101111', '111101', '100000000000000000010000000000001'); //Trinom
main('10111101010101010101', '01010101010101111101', '100000000100000000000000000000001'); //Trinom
// main('101111', '111101', '101000000000000000000000000000001'); //Trinom
// main('101111', '111101', '110000000000000000000000000000001'); //Trinom
// main('101111', '111101', '100000000000000000010010001000001'); //Pentanom
// main('101111', '111101', '1100001'); //Trinom

function main(a, b, p) {
    const MATRIX_SIZE = p.length - 1;
    const Q = initReductionMatrix(p);

    const A = splitIntoPowers(a);
    const B = splitIntoPowers(b);
    const {matrixL, matrixU} = buildTeplitsMatrices(A);

    const d = multiplyMatrixByVector(matrixL, B);
    const e = multiplyMatrixByVector(matrixU, B);

    const c = xorVectors(d, multiplyMatrixByVector(transposeMatrix(Q), e));

    printStatus();

    function initReductionMatrix(p) {
        const meaningfulPowers = p.split('').reverse().map((el, idx) => {
            return {el: parseInt(el), index: idx}
        }).filter(el => el.el === 1);

        return buildReductionMatrix({
            m: meaningfulPowers.pop().index,
            k: meaningfulPowers.map(el => el.index)
        });
    }

    function buildReductionMatrix({m: m, k: k}) {
        const s = calculateDiff(m, k);
        console.log(m, k.join(' '), s);
        if (Number.isInteger(s)) {
            return buildReductionMatrixForESP(m, s);
        }
        return buildGenericReductionMatrix(m, k);
    }

    function calculateDiff(m, k) {
        const powers = [].concat(k);
        powers.push(m);
        let s = Math.abs(powers[0] - powers[1]);
        for (let i = 1; i < powers.length - 1; i++) {
            const diff = Math.abs(powers[i] - powers[i + 1]);
            if (diff === s) {
                continue;
            }
            return s / diff;
        }

        return s;
    }

    function buildReductionMatrixForESP(m, s) {
        const Q = createMatrix(m);
        Q.pop();
        for (let row = 0; row < Q.length; row++) {
            for (let col = 0; col < Q[0].length; col++) {
                if (row < s && (col - row) % s === 0 || row >= s && row - col === s) {
                    Q[row][col] = Q[row][col] ^ 1;
                }
            }
        }
        return Q;
    }

    function buildGenericReductionMatrix(m, k) { //TODO: fix conditions
        const Q = createMatrix(m);
        Q.pop();
        console.log(Q.length, Q[0].length);
        for (let y = 0; y < Q.length; y++) {
            for (let x = 0; x < Q[0].length; x++) {
                k.forEach(basis => {
                    k.forEach(kX => {
                        if ((y - x) % (m - kX) === 0 && y > x && x + basis < Q[0].length) {
                            // Q[y][(x + basis) % m] = Number.isInteger(Q[y][(x + basis) % m]) ? Q[y][(x + basis) % m] ^ 1 : 1;
                            Q[y][(x + basis) % m] = Q[y][(x + basis) % m] ^ 1;
                        }
                    });
                    if ((x - y) === 0 && x - y >= 0 && x + basis < Q[0].length) {
                        // Q[y][(x + basis) % m] = Number.isInteger(Q[y][(x + basis) % m]) ? Q[y][(x + basis) % m] ^ 1 : 1;
                        Q[y][(x + basis) % m] = Q[y][(x + basis) % m] ^ 1;
                    }
                });
            }
        }

        return Q;
    }

    function splitIntoPowers(poly) {
        return poly.split('').reverse().map(el => parseInt(el, 2)).concat(new Array(MATRIX_SIZE - poly.length).fill(0));
    }

    function buildTeplitsMatrices(splited) {
        const matrixL = createMatrix(MATRIX_SIZE);
        const matrixU = createMatrix(MATRIX_SIZE);

        for (let row = 0; row < MATRIX_SIZE; row++) {
            for (let col = 0; col < MATRIX_SIZE; col++) {
                if (row >= col) {
                    matrixL[row][col] = splited[row - col] || 0;
                } else {
                    matrixU[row][col] = splited[MATRIX_SIZE - col + row] || 0;
                }
            }
        }
        matrixU.pop();
        return {matrixL, matrixU};
    }

    function createMatrix(m) {
        // return new Array(m).fill(0).map(el => new Array(m).fill('-'));
        return new Array(m).fill(0).map(el => new Array(m).fill(0));
    }

    function multiplyMatrixByVector(matrix, vector) {
        return matrix.map((row, idx) => multiplyVectorByScalar(row, vector[idx]));
    }

    function multiplyVectorByScalar(vector, scalar) {
        return vector.reduce((prev, curr) => prev ^ (curr & scalar), 0);
    }

    function transposeMatrix(M) {
        return M[0].map((col, i) => M.map((row) => row[i]));
    }

    function xorVectors(v1, v2) {
        return v1.map((el, idx) => el ^ v2[idx]);
    }

    function printMatrix(M) {
        console.log(M.map(row => row.join(' ')).join('\n'));
    }

    function printVector(A) {
        console.log(A.join(' '));
    }

    function printStatus() {
        printMatrix(Q);
        console.log();
        printVector(A);
        printVector(B);
        console.log();
        printMatrix(matrixL);
        console.log();
        printMatrix(matrixU);
        console.log();
        printVector(d);
        console.log();
        printVector(e);
        console.log();
        console.log();
        printVector(c);
    }
}

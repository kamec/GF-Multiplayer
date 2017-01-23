// main('101111', '111101', '1001001001001'); // ESP
// main('101111', '111101', '1100000000000000000000000000000001'); //Trinom
main('101111', '111101', '1000000000000000000010000000000001'); //Trinom
// main('101111', '111101', '1100001'); //Trinom

function main(a, b, p) {
    const MATRIX_SIZE = p.length;
    const Q = initReductionMatrix(p);


    const A = splitIntoPowers(a);
    const B = splitIntoPowers(b);
    const {matrixL, matrixU} = buildTeplitsMatrices(A);

    const d = multiplyMatrixByVector(matrixL, B);
    const e = multiplyMatrixByVector(matrixU, B);

    // printStatus();

    function printStatus() {
        console.log();
        console.log(A);
        console.log(B);
        console.log();
        console.log(matrixL);
        console.log();
        console.log(matrixU);
        console.log();
        console.log(d);
        console.log();
        console.log(e);
    }

    function initReductionMatrix(p) {
        const meaningfulPowers = p.split('').reverse().map((el, idx) => {
            return {el: parseInt(el), index: idx}
        }).filter(el => el.el === 1);

        return buildReductionMatrix({
            m: meaningfulPowers.pop().index,
            k: meaningfulPowers.slice(1).map(el => el.index)
        });
    }

    function buildReductionMatrix({m: m, k: k}) {
        k.push(0);
        const s = m / (k.length);
        console.log(m, k, s);
        if (Number.isInteger(s) && k.length > 3) {
            return buildMatrixForESP(m, s);
        }
        const Q = createMatrix(m - 1);
        Q.pop();
        for (let row = 0; row < Q.length; row++) {
            for (let col = 0; col < Q[0].length; col++) {
                if (k.some(k => {
                        return col - row === k || row >= m - k && (row - col) % (m - k) === 0
                    })
                ) {
                    Q[row][col] = 1;
                }
            }
        }
        console.log(Q.map(row => row.join(' ')).join('\n'));
        return Q;
    }

    function buildMatrixForESP(m, s) {
        const Q = createMatrix(m - 1);
        Q.pop();
        for (let row = 0; row < Q.length; row++) {
            for (let col = 0; col < Q[0].length; col++) {
                if ((col - row) % s === 0 && row < s) {
                    Q[row][col] = 1;
                }
                if (row >= s && row - col === s) {
                    Q[row][col] = 1;
                }
            }
        }
        console.log(Q.map(row => row.join('')).join('\n'));
        return Q;
    }

    function splitIntoPowers(poly) {
        return poly.split('').reverse().map(el => parseInt(el, 2)).concat(new Array(MATRIX_SIZE - poly.length).fill(0));
    }

    function buildTeplitsMatrices(splited) {
        const matrixL = createMatrix(MATRIX_SIZE);
        const matrixU = createMatrix(MATRIX_SIZE);

        for (let col = 0; col < MATRIX_SIZE; col++) {
            for (let row = 0; row < MATRIX_SIZE; row++) {
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
        return new Array(m).fill(0).map(el => new Array(m).fill('-'));
    }

    function multiplyMatrixByVector(matrix, vector) {
        return matrix.map((row, idx) => multiplyVectorByScalar(row, vector[idx]));
    }

    function multiplyVectorByScalar(vector, scalar) {
        return vector.reduce((prev, curr) => prev ^ (curr & scalar), 0);
    }
}

main('101111', '111101', '1000011');

function main(a, b, p) {
    const MATRIX_SIZE = p.length;
    const POLY_TYPE = recognisePolynomParameters(p);


    const A = splitIntoPowers(a);
    const B = splitIntoPowers(b);
    const {matrixL, matrixU} = buildTeplitsMatrices(A);

    const d = multiplyMatrixByVector(matrixL, B);
    const e = multiplyMatrixByVector(matrixU, B);

    printStatus();

    function printStatus() {
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


    function recognisePolynomParameters(p) {
        const meaningfulPowers = p.split('').reverse().map((el, idx) => {
            return {el: parseInt(el), index: idx}
        }).filter(el => el.el === 1);

        return buildReductionMatrix({
            m: meaningfulPowers.pop().index,
            k: meaningfulPowers.filter(el => el.index !== 0).map(el => el.index),
            s: this.m / p.length
        });
    }

    function buildReductionMatrix({m: m, k: k, s: s = 0}) {
        console.log(m, k, s);
        const Q = createMatrix(m - 1).pop();
        for (let row = 0; row < Q.length; row++) {
            for (let col = 0; col < Q[0].length; col++) {

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
        return new Array(m).fill(0).map(el => new Array(m).fill(0));
    }

    function multiplyMatrixByVector(matrix, vector) {
        return matrix.map((row, idx) => multiplyVectorByScalar(row, vector[idx]));
    }

    function multiplyVectorByScalar(vector, scalar) {
        return vector.reduce((prev, curr) => prev ^ (curr & scalar), 0);
    }
}

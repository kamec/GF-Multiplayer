const fs = require('fs');
const jsMultiplier = require('./jsMultiplier');

module.exports = {
    main: function () {
        const p = '1000011';
        fs.writeFile(`${__dirname}/../tmp/test.c`, this.generateCode(p), err => {
            if (err) {
                console.log(err);
                fs.mkdir(`${__dirname}/../tmp`, err => {
                        if (err) console.log(err)
                    }
                );
                this.main();
            }
            console.log('Done');
            jsMultiplier.main('100101', '101001', p);
        });
    },

    generateCode: function (p) {
        const size = p.length - 1;
        let generatedCode = '\#include <stdio.h>\r\n\#include <stdlib.h>\r\n';
        generatedCode += generateSplitting('a', size);
        generatedCode += generateSplitting('b', size);
        generatedCode += generateTeplitsMatricesBuilding(size);
        generatedCode += generateResultVectorCalculation(size, p);
        generatedCode += generateMultiplicationResult(size);

        return generatedCode;


        function generateSplitting(letter, size) {
            let result = '';
            for (let i = 0; i < size; i++) {
                result += `#define ${letter}${i}\t((${letter.toUpperCase()}&${Math.pow(2, i)})${i !== 0 ? '>>' + i : ''})\r\n`;
            }
            return result += '\r\n';
        }

        function generateTeplitsMatricesBuilding(size) {
            let result = '';
            for (let i = 0; i < size; i++) {
                result += `#define d${i}\t`;
                for (let j = 0; j <= i; j++) {
                    result += `(a${i - j}&b${j}) ${i === j ? '\r\n' : '^ '}`;
                }
            }
            size = size - 1;
            for (let i = 0; i < size; i++) {
                result += `#define e${i}\t`;
                for (let j = 0; j <= size - 1 - i; j++) {
                    result += `(a${size - j}&b${j + i + 1}) ${i === size - 1 - j ? '\r\n' : '^ '}`;
                }
            }
            return result += '\r\n';
        }

        function generateResultVectorCalculation(size, p) {
            const QT = jsMultiplier.transposeMatrix(jsMultiplier.initReductionMatrix(p));
            const preparedMatrix = QT.map(V => V.map((el, idx) => {
                return {el: el, idx: idx}
            }).filter(cell => cell.el !== 0).map(cell => cell.idx));

            let result = '';
            for (let i = 0; i < size; i++) {
                result += `#define c${i}\t((d${i}`;
                preparedMatrix[i].forEach(position => result += `^e${position}`);
                result += `)${i === 0 ? '' : ` << ${i}`})\r\n`
            }

            return result += '\r\n';
        }

        function generateMultiplicationResult(size) {
            let result = '#define cmul (';
            for (let i = 0; i < size; i++) {
                result += `${i === 0 ? '' : '^'}c${i}`;
            }
            result += ')\r\n';
            result += `int main(int argc, char *argv[])\r\n{\r\n\tchar *pCh;\r\n\tunsigned int A = strtoul(argv[1], &pCh, 2);\r\n\tunsigned int B = strtoul(argv[2], &pCh, 2);\r\n\tunsigned int C;\r\n\tC = cmul;\r\n\tprintf("%\\n", C);\r\n\treturn C;\r\n}\r\n`;

            return result += '\r\n';
        }

    }

};

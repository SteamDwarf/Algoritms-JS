"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const sourceMatrix = document.querySelector('#source-matrix'),
          resultMatrix = document.querySelector('#result-matrix'),
          matrixCellInput = sourceMatrix.querySelectorAll('.matrix-cell input'),
          matrixCellRes = resultMatrix.querySelectorAll('.matrix-cell div'),
          btnCount = document.querySelector('#btn-count'),
          rows = 3,
          columns = 4;


    function getValues(row, col) {
        let matrixValues = [[], [], []],
            k = 0;

            for (let j = 0; j < row; j++) {
                for (let i = 0; i < col; i++) {
                    if(k < (j + 1) * col) {
                        matrixValues[j].push(matrixCellInput[k].value);
                        k++;
                    } else {
                        break;
                    }    
                }
            }
        //console.log(matrixValues);
        return matrixValues;
    }

    function exceptionCycle(cycles, row, col) {
        let matrixValues = getValues(row, col);
        //console.log(matrixValues);

        for (let i = 0; i < cycles; i++) {  // i = Какой запущен цикл с такого уравнения и считаем и с такого члена начинаем делить
            for(let j = i; j < row; j++) { // j = какой уровнение на данный момент перебирается

                let k = matrixValues[j][i];
                //console.log('k:'+k);
                for (let m = i; m < col; m++) { // m - какой элемент уравнения делится
                    matrixValues[j][m] /= k;
                    //console.log('value:'+matrixValues[j][m]);

                    if(j > i) {
                        matrixValues[j][m] -= matrixValues[i][m];
                    }
                }    
            }
        } 

        return matrixValues;
    }

    function findX(values) {
        let arrayX = [];
            
        for(let i = rows; i > 0; i--) {
            let row = values[i - 1],
                b = row[columns - 1],
                arrayNums = [],
                tempNum = b;
            console.log('строка:' + i);
            console.log(b);

            if(i === rows) {
                let preLastNum = row[columns - 2],
                    lastX = b / preLastNum;
                arrayX.unshift(lastX);

                console.log('x3:' + lastX);

            }else {

                for(let j = rows - i; j > 0; j--) {
                    let numX = row[columns - (j + 1)],
                        numMulX = numX * arrayX[arrayX.length - j];
                    arrayNums.unshift(numMulX);

                    console.log('коэффициентX:' + (j + 1));
                }

                console.log('умноженные числа:' + arrayNums);

                arrayNums.forEach(num => {
                    tempNum -= num;
                    console.log('временное число:' + tempNum);
                });
    
                arrayX.unshift(tempNum);

                console.log('x' + i + arrayX);
            }
        }

        console.log('корни уравнения:' + arrayX);
    }

    function setValues(values, row, col) {
        let k = 0;

        for(let i = 0; i < row; i++) {
            for(let j = 0; j < col; j++) {
                if(k < (i + 1) * col) {
                    matrixCellRes[k].textContent = values[i][j];
                    k++;
                }
            }
        }
    }
    
    btnCount.addEventListener('click', () => {
        let newMatrixValue = exceptionCycle(2, 3, 4);
        setValues(newMatrixValue, rows, columns);
        findX(newMatrixValue);
    });
    
});









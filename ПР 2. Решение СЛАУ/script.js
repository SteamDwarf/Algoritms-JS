"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const sourceMatrix = document.querySelector('#source-matrix'),
          tringularMatrix = document.querySelector('#tringular-matrix'),
          matrixCellInput = sourceMatrix.querySelectorAll('.matrix-cell input'),
          matrixCellTring = tringularMatrix.querySelectorAll('[data-cell="tring"] div'),
          matrixCellResult = tringularMatrix.querySelectorAll('[data-cell="X"] div'),
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
/*                 console.log('цикл: ' + (i + 1));
                console.log('уравнение: ' + (j + 1));
                console.log('коэффициент: ' + k); */

                    //console.log('k:'+k);
                if(k < 0 || k > 0) {
                    for (let m = i; m < col; m++) { // m - какой элемент уравнения делится
                        if(j === i) {
                            matrixValues[j][m] /= k;
                        } else {
                            matrixValues[j][m] -= matrixValues[i][m] * k;
                        }
    
                        /* if(k < 0 || k > 0) {
                            matrixValues[j][m] /= k;
                            //console.log('value:'+matrixValues[j][m]);
                            if(j > i) {
                                matrixValues[j][m] -= matrixValues[i][m];
                            }
                        } else break; */
                    }  
                } else continue;
                  
            }
        }

            //console.log(matrixValues);

        for (let i = cycles; i >= 0; i--) {  // i = Какой запущен цикл с такого уравнения и считаем и с такого члена начинаем делить
            for(let j = i; j >= 0; j--) { // j = какой уровнение на данный момент перебирается
                let k = matrixValues[j][i];

                console.log('цикл: ' + (i + 1));
                console.log('уравнение: ' + (j + 1));
                console.log('коэффициент: ' + k);
                console.log('k:'+k);

                if(k < 0 || k > 0) {
                    for (let m = columns - 1; m > 0; m--) { // m - какой элемент уравнения делится
                        console.log('m' + m + '=' + matrixValues[j][m]);
                        if(j === i) {
                            matrixValues[j][m] /= k;
                        } else {
                            matrixValues[j][m] -= matrixValues[i][m] * k;
                        }
                        /* if(k < 0 || k > 0) {
                            //console.log('m' + m + '=' + matrixValues[j][m]);
                            matrixValues[j][m] /= k;
                                
                            if(j < i) {
                                matrixValues[j][m] -= matrixValues[i][m];
                            }
                        } else break; */
                    } 
                } else continue;
                   
            }
        }
         

        return matrixValues;
    }

    function findX(values) {
        let arrayX = [];

        console.log(values);
        for(let i = 0; i < rows; i++) {
            arrayX.push(values[i][columns - 1]);
        }
            
        /* for(let i = rows; i > 0; i--) {
            let row = values[i - 1],
                b = row[columns - 1],
                arrayNums = [],
                tempNum = b;
            //console.log('строка:' + i);
            //console.log(b);

            if(i === rows) {
                let preLastNum = row[columns - 2],
                    lastX = b / preLastNum;
                arrayX.unshift(lastX);

                //console.log('x3:' + lastX);

            }else {

                for(let j = rows - i; j > 0; j--) {
                    let numX = row[columns - (j + 1)],
                        numMulX = numX * arrayX[arrayX.length - j];
                    arrayNums.unshift(numMulX);

                    //console.log('коэффициентX:' + (j + 1));
                }

                //console.log('умноженные числа:' + arrayNums);

                arrayNums.forEach(num => {
                    tempNum -= num;
                    //console.log('временное число:' + tempNum);
                });
    
                arrayX.unshift(tempNum);

                //console.log('x' + i + arrayX);
            }
        }

        //console.log('корни уравнения:' + arrayX); */

        return arrayX;
    }

    function setValues(cellsTring, cellsRes, valuesTring, valuesRes, row, col) {
        let k = 0;

        for(let i = 0; i < row; i++) {
            for(let j = 0; j < col; j++) {
                if(k < (i + 1) * col) {
                    cellsTring[k].textContent = valuesTring[i][j];
                    k++;
                }
            }

            for(let m = 0; m < 1; m++) {
                cellsRes[i].textContent = valuesRes[i];
            }
        }
    }
    
    btnCount.addEventListener('click', () => {
        let newMatrixValue = exceptionCycle(rows - 1, rows, columns),
            resultNum = findX(newMatrixValue);

        setValues(matrixCellTring, matrixCellResult, newMatrixValue, resultNum, rows, columns);
    });
    
});









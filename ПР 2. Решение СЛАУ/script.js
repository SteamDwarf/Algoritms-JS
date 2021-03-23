"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const sourceMatrix = document.querySelector('#source-matrix .matrix'),
          tringularMatrix = document.querySelector('#tringular-matrix .matrix'), 
          matrixSizeSelect = document.querySelector('#matrix-size'),
          btnCount = document.querySelector('#btn-count'),
          btnClear = document.querySelector('#btn-clear'),
          btnZeydel = document.querySelector('#btn-count-zeydel'),
          resZeydel = document.querySelector('.zeydel-res');

    let matrixCellInput, matrixCellTring, rows, columns, 
        eps = 0.0001,
        prevApproximateX = [],
        nextApproximateX = [],
        diffApproximate = [],
        count;

    function createGrid() {
        let size = +matrixSizeSelect.value;
        sourceMatrix.textContent = '';
        tringularMatrix.textContent = '';

        for(let i = 0; i < size; i++) {
            let tr = document.createElement('tr');
            tr.classList.add('matrix-row');


            for(let j = 0; j < size + 1; j++) {
                let td = document.createElement('td');
                let input = document.createElement('input');

                td.classList.add('matrix-cell');
                input.setAttribute('type', 'text');
                if(j === size) {
                    input.classList.add('cell-result');
                }

                td.append(input);
                tr.append(td);
            }

            sourceMatrix.append(tr);
        }

        for(let i = 0; i < size; i++) {
            let tr = document.createElement('tr');
            tr.classList.add('matrix-row');

            for(let j = 0; j < size + 1; j++) {
                let td = document.createElement('td');
                let div = document.createElement('div');

                td.classList.add('matrix-cell');
                if(j === size) {
                    div.classList.add('cell-result');
                }

                td.append(div);
                tr.append(td);
            }

            tringularMatrix.append(tr);
        }

        rows = size;
        columns = size + 1;
        matrixCellInput = sourceMatrix.querySelectorAll('.matrix-cell input');
        matrixCellTring = tringularMatrix.querySelectorAll('.matrix-cell div');
    }

    function createApproximate() {
        for(let i = 0; i < rows; i++) {
            prevApproximateX[i] = 0;
        }
    }

    function getValues() {
        let matrixValues = [],
            k = 0;

            for (let j = 0; j < rows; j++) {
                matrixValues.push([]);
                for (let i = 0; i < columns; i++) {
                    if(k < (j + 1) * columns) {
                        matrixValues[j].push(matrixCellInput[k].value);
                        k++;
                    } else {
                        break;
                    }    
                }
            }

        if(+matrixValues[0][0] === 0) {
            matrixValues.forEach((row, i) => {
                if(+row[0] !== 0) {
                    let firstRow = matrixValues[0];
                    matrixValues[0] = row;
                    matrixValues[i] = firstRow;
                }
            });
        }

        return matrixValues;
    }

    function exceptionCycle(cycles, row, col) {
        let matrixValues = getValues();

        for (let i = 0; i < cycles; i++) {  // i = Какой запущен цикл с такого уравнения и считаем и с такого члена начинаем делить
            for(let j = i; j < row; j++) { // j = какой уровнение на данный момент перебирается

                let k = matrixValues[j][i];
                if(k < 0 || k > 0) {
                    for (let m = i; m < col; m++) { // m - какой элемент уравнения делится
                        if(j === i) {
                            matrixValues[j][m] /= k;
                        } else {
                            matrixValues[j][m] -= matrixValues[i][m] * k;
                        }
                    }  
                } else continue; 
            }
        }

        for (let i = cycles; i >= 0; i--) {  // i = Какой запущен цикл с такого уравнения и считаем и с такого члена начинаем делить
            for(let j = i; j >= 0; j--) { // j = какой уровнение на данный момент перебирается

                let k = matrixValues[j][i];
                if(k < 0 || k > 0) {
                    for (let m = columns - 1; m > 0; m--) { // m - какой элемент уравнения делится
                        if(j === i) {
                            matrixValues[j][m] /= k;
                        } else {
                            matrixValues[j][m] -= matrixValues[i][m] * k;
                        }
                    } 
                } else continue;    
            }
        }
         
        return matrixValues;
    }

    function xInsertion(equations) {
        equations.forEach((eq, i) => {
            for(let j = 0; j < rows; j++) {
                if(i !== j) {
                    if(i === 0 || i < j) {
                        let reg = new RegExp(`x${j+1}`);
                        eq = eq.replace(reg, prevApproximateX[j]);
    
                    } else {
                        let reg = new RegExp(`x${j+1}`);
                        eq = eq.replace(reg, nextApproximateX[j]);
                    }
                }
            }
            nextApproximateX[i] = eval(eq).toFixed(7); 
        });

        for(let i = 0; i < rows; i++) {
            diffApproximate[i] = Math.abs(prevApproximateX[i] - nextApproximateX[i]);
        }

        let maxDiff = Math.max.apply(0, diffApproximate);

        nextApproximateX.forEach((num, i) => {
            prevApproximateX[i] = num;
        });

        return maxDiff;
    }

    function reducingEquations(values) {
        let equations = [],
            maxDiff;
        count = 0;

        for(let i = 0; i < rows; i++) {
            let x = values[i][columns - 1],
                divider = 1;

            values[i].forEach((num, j) => {
                if(i === j) {
                    divider = num;
                } else if(j === columns - 1) {
                   x = x;
                }
                else {
                    x += `+${-num}*x${j + 1}`;
                }
            });

            x = `(${x}) / ${divider}`;
            equations.push(x);
        }
 
        do {
           ++count;
           maxDiff = xInsertion(equations);
        }while (maxDiff > eps);
    }

    

    function setValuesZeydel() {
        let countBlock = document.createElement('div');
        resZeydel.textContent = '';

        nextApproximateX.forEach((root, i) => {
            let resultBlock = document.createElement('div'),
                rootsSpan = document.createElement('span'),
                resultSpan = document.createElement('span');

            rootsSpan.insertAdjacentHTML('beforeend', `x<sub>${i + 1}</sub> = `);
            resultSpan.textContent = root;

            resultBlock.append(rootsSpan);
            resultBlock.append(resultSpan);
            resZeydel.append(resultBlock);
        });
        countBlock.textContent = `Количество итераций: ${count}`;
        resZeydel.append(countBlock);
    }

    function setValues(cellsTring, valuesTring, row, col) {
        let k = 0;

        for(let i = 0; i < row; i++) {
            for(let j = 0; j < col; j++) {
                if(k < (i + 1) * col) {
                    cellsTring[k].textContent = valuesTring[i][j];
                    k++;
                }
            }
        }
    }
    
    createGrid();

    matrixSizeSelect.addEventListener('change', () => {
        createGrid();
        resZeydel.textContent = '';
    });

    btnCount.addEventListener('click', () => {
        let newMatrixValue = exceptionCycle(rows - 1, rows, columns);
        setValues(matrixCellTring, newMatrixValue, rows, columns);
    });

    btnClear.addEventListener('click', () => {
        createGrid();
        resZeydel.textContent = '';
    });

    btnZeydel.addEventListener('click', () => {
       let matrixValue = getValues();
       createApproximate();
       reducingEquations(matrixValue);
       setValuesZeydel();
    });
    
});









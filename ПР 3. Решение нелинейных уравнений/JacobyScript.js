"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const expressionsSystem = {
        firstSystem: {
            firstEq: {
                exp: 'Math.sin(y + 2) - x - 1.5',
                derivX: '-1',
                derivY: 'Math.cos(y + 2)'
            },
            secondEq: {
                exp: 'y + Math.cos(x - 2) - 0.5',
                derivX: '-1 * Math.sin(x - 2)',
                derivY: '1'
            }
        },
        secondSystem: {
            firstEq: {
                exp: 'Math.sin(x + y) - 1.2 * x - 0.2',
                derivX: 'Math.cos(x + y) - 1.2',
                derivY: 'Math.cos(y + x)'
            },
            secondEq: {
                exp: 'x**2 + y**2 - 1',
                derivX: '2*x',
                derivY: '2*y'
            }
        }
    };

    const functionSystemExamples = document.querySelectorAll('.function-system');
    const btnCount = document.querySelector('#btn-count');
    const inputApproximateX = document.querySelector('[name="x-approximate"]');
    const inputApproximateY = document.querySelector('[name="y-approximate"]');
    const resOutput = document.querySelector('.NJ_block .res_output');
    const iterationOutput = document.querySelector('.NJ_block .iteration_output');

    const eps = 0.0001;

    let x, y, systemName;
    let k = 0;
    let rows = 2;
    let columns = 3;
    let matrixJacoby = [[], []];
    let matrixF = [];
        

    function refresh() {
        k = 0;   
        matrixJacoby = [[], []];
        matrixF = [];
        resOutput.textContent = '';
        iterationOutput.textContent = '';
    }

    function deactiveSystem() {
        functionSystemExamples.forEach(funcSyst => {
            funcSyst.classList.remove('selected-func-system');
        });
    }

    function systemSelection(e) {
        deactiveSystem();

        let targetFunc = e.target;
        let systemBlock;

        if(targetFunc.getAttribute('data-function')) {
            systemName = targetFunc.getAttribute('data-function');
        } else {
            systemName = targetFunc.parentNode.getAttribute('data-function');
        }

        systemBlock = document.querySelector(`[data-function="${systemName}"]`);
        systemBlock.classList.add('selected-func-system');
    }


    function matrixJacobyFilling() {
        let eqNum = 'firstEq';

        matrixJacoby.forEach(row => {
            let expression = expressionsSystem[systemName][eqNum];

            row[0] = eval(expression.derivX);
            row[1] = eval(expression.derivY);
            eqNum = 'secondEq';
        });
    }

    function matrixFilling() {
        let expression = expressionsSystem[systemName];

        matrixF[0] = eval(expression.firstEq.exp);
        matrixF[1] = eval(expression.secondEq.exp);

        matrixJacobyFilling();
    }

    function matrixCombining() {
        let matrixGaus = [[],[]];

        matrixGaus.forEach((row, i) => {
            for(let j = 0; j < rows; j++) {
                row.push(matrixJacoby[i][j]);
            }
            row.push(matrixF[i]);
        });

        return matrixGaus;
    }

    function exceptionCycle(cycles, row, col) {
        let matrixValues = matrixCombining();

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

    function gettingNewApproximate() {
        let newMatrix = exceptionCycle(rows-1, rows, columns); 
        let deltaRoot = [];
        
        newMatrix.forEach(row => {
            deltaRoot.push(row[columns - 1]);
        });

        x -= deltaRoot[0];
        y -= deltaRoot[1];

        deltaRoot = [];
    }

    function numCheck(num) {
        return Math.abs(num) < eps;
    }

    function findRoots() {
        let finished;
        x = +inputApproximateX.value;
        y = +inputApproximateY.value;
        k = 0;
        do {
            matrixFilling();
            gettingNewApproximate();
            finished = matrixF.every(numCheck);
            k++;
        }while(!finished);
    }

    function setValues() {
        resOutput.insertAdjacentHTML('beforeend', `
            <span>x = ${x}</span> </br>
            <span>y = ${y}</span>
       `);
       iterationOutput.textContent = k;
    }

    functionSystemExamples.forEach(funcSyst => {
        funcSyst.addEventListener('click', (e) => {
            systemSelection(e);
        });
    });

    btnCount.addEventListener('click', () => {
        refresh();
        findRoots();
        setValues();
    }); 
});
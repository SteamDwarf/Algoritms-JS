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
        }
    };

    let x = 1, y = 1, eps = 0.0001,
        rows = 2, columns = 3,
        matrixJacoby = [[], []],
        matrixF = [];

    function matrixJacobyFilling() {
        let eqNum = 'firstEq';
        matrixJacoby.forEach(row => {
            let expression = expressionsSystem.firstSystem[eqNum];
            row[0] = eval(expression.derivX);
            row[1] = eval(expression.derivY);
            eqNum = 'secondEq';
        });

        console.log(matrixJacoby);
    }

    function matrixFilling() {
        let expression = expressionsSystem.firstSystem;
        matrixF[0] = eval(expression.firstEq.exp);
        matrixF[1] = eval(expression.secondEq.exp);

        matrixJacobyFilling();
        console.log(matrixF);
    }

    function matrixCombining() {
        let matrixGaus = [[],[]];

        matrixGaus.forEach((row, i) => {
            for(let j = 0; j < rows; j++) {
                row.push(matrixJacoby[i][j]);
            }
            row.push(matrixF[i]);
        });

        console.log(matrixGaus);
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
        let newMatrix = exceptionCycle(rows-1, rows, columns), 
            deltaRoot = [];
        
        newMatrix.forEach(row => {
            deltaRoot.push(row[columns - 1]);
        });

        x -= deltaRoot[0];
        y -= deltaRoot[1];
        console.log(deltaRoot);
        deltaRoot = [];
        console.log(deltaRoot);
        console.log(x, y);
    }

    function numCheck(num) {
        return Math.abs(num) < eps;
    }

    function findRoots() {
        let finished;
        do {
            matrixFilling();
            gettingNewApproximate();
            finished = matrixF.every(numCheck);
        }while(!finished);

        console.log(x ,y);
    }

    findRoots();
});
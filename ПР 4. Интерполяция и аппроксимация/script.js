"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const defaultDataTable = document.querySelector('#default-data_table');
    //const genericDataTable = document.querySelector('#generic-data_table');
    const defaultXCells = defaultDataTable.querySelectorAll('#row-x .cell_input');
    const defaultYCells = defaultDataTable.querySelectorAll('#row-y .cell_input');
    //const genericXCells = genericDataTable.querySelectorAll('#row-x .cell_input');
    const btnCountLagrange = document.querySelector('#btn_count-Lagrange');
    const btnCountSpline = document.querySelector('#btn_count-spline');
    const fragmentationInput = document.querySelector('.fragmentation_input');
    const cordOutput = document.querySelector('#cord-output');

    let xCords = [];
    let yCords = [];
    let resultX = [];
    let resultY = [];
    let splines = [];
    let x;
    let step;

    function compare(a, b) {
        if (a > b) return 1;
        if (a == b) return 0;
        if (a < b) return -1;
      }

    function MakeFragmentation(cordArray) {
        let a = +cordArray[0];
        let result = [a];

        if(fragmentationInput.value === ''){
            step = 0.25;
        }else {
            step = +fragmentationInput.value;
        }

        do{
            a += step;
            result.push(a);

        }while(a < cordArray[cordArray.length - 1]);

        return result;
    }

    function GettingData(defaultCellsX, defaultCellsY) {
        defaultCellsX.forEach(cell => {
            if(cell.value !== "") {
                xCords.push(cell.value);
            }
        });

        defaultCellsY.forEach(cell => {
            if(cell.value !== "") {
                yCords.push(cell.value);
            }
        });
    }

    function DrawGraph() {

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const data = new google.visualization.DataTable();

            let options = {
                curveType: 'function',
                legend: 'none',
                focusTarget: 'category',
                }; 
            let chart = new google.visualization.LineChart(document.querySelector('#curve_chart'));
            
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(resultX.length);

            for (let i = 0; i < resultX.length; i++) {
                data.setCell(i, 0, resultX[i]);
                data.setCell(i, 1, resultY[i]);
            }

            data.sort([{column:0}]);
            chart.draw(data, options);
        }
    }

    function GetFunctionY(genericXArray) {
        let resultArray = [];

        genericXArray.forEach(num => {
            let result = 0;
            x = num;

            for(let i = 0; i < xCords.length; i++) {
                let polynom = GetPolynom(i);
                let superposition = yCords[i] * polynom;

                result += superposition;
            }

            resultArray.push(result);
        });

        return resultArray;
    }

    function GetPolynom(polIndex) {
        let polynom = 1;

        xCords.forEach((xj, j) => {
            if(j !== polIndex){
                let fraction = (x - xj) / (xCords[polIndex] - xj);
                polynom *= fraction;
            }
        });

        return polynom;
    }

    function BuildSpline(x, y) {
        let n = x.length;
        splines = [];

        for (let i = 0; i < n; i++){
            splines.push({a:null, b:null, c:null, d:null, x:null});
        }

        for (let i = 0; i<n; i++){
            splines[i].x = +x[i];
            splines[i].a = +y[i];
        }
        splines[0].c = splines[n-1].c = 0;

        let alpha = new Array(n - 1).fill(0);
        let beta  = new Array(n - 1).fill(0);

        for (let i = 1; i < n - 1; ++i) {

            let hi  = x[i] - x[i - 1];
            let hi1 = x[i + 1] - x[i];
            let A = hi;
            let C = 2.0 * (hi + hi1);
            let B = hi1;
            let F = 6.0 * ((y[i + 1] - y[i]) / hi1 - (y[i] - y[i - 1]) / hi);
            let z = (A * alpha[i - 1] + C);
            
            alpha[i] = -B / z;
            beta[i] = (F - A * beta[i - 1]) / z;
        }

        for (let i = n - 2; i > 0; --i) {
            splines[i].c = alpha[i] * splines[i + 1].c + beta[i];
        }

        for (let i = n - 1; i > 0; --i){
            let hi = x[i] - x[i - 1];
            splines[i].d = (splines[i].c - splines[i - 1].c) / hi;
            splines[i].b = hi * (2.0 * splines[i].c + splines[i - 1].c) / 6.0 + (y[i] - y[i - 1]) / hi;
        }
    }

    function Interpolate(x) {
        if (splines == null){
            return NaN;
        }

        const n = splines.length;
        let s = {a:null,b:null,c:null,d:null,x:null};

        if (x <= splines[0].x){
            s = splines[0];
        }else if (x >= splines[n - 1].x) {
            s = splines[n - 1];
        }else {
            let i = 0;
            let j = n - 1;

            while (i + 1 < j){
                let k = Math.round(i + (j - i) / 2);

                if (x <= splines[k].x){
                    j = k;
                }else {
                    i = k;
                }
            }
            s = splines[j];
        }

        let dx = x - s.x;  
        return s.a + (s.b + (s.c / 2.0 + s.d * dx / 6.0) * dx) * dx;
    }

    function MethodLagrenge(defaultCellsX, defaultCellsY) {
        let result;

        xCords = [];
        yCords = [];

        GettingData(defaultCellsX, defaultCellsY);

        resultX = MakeFragmentation(xCords);
        result = GetFunctionY(resultX);
        resultY = result;
        

        /* if(genericCellsX[0].value !== "") {
            let genericX = [];
            let fragmentedX = [];
    
            genericCellsX.forEach(cell => {
                if(cell.value !== '') {
                    genericX.push(cell.value);
                }
            });

            genericX.sort(compare);
            fragmentedX = MakeFragmentation(genericX);
            result = GetFunctionY(fragmentedX);

            fragmentedX.forEach(num => {
                resultX.push(num);
            });

            result.forEach((num, i) => {
                resultY.push(num);
            });

            return;
        } */
    }

    function MethodSpline(defaultCellsX, defaultCellsY) {
        let result;

        xCords = [];
        yCords = [];

        GettingData(defaultCellsX, defaultCellsY);
        resultX = MakeFragmentation(xCords);

        BuildSpline(xCords, yCords);

        resultX.forEach((num, i) => {
            resultY[i] = Interpolate(+num);
        });
    }

    function SetValues() {
        cordOutput.innerHTML = '';
        resultX.forEach((num, i) => {
            let cordBlock = document.createElement('div');
            let xSpan = document.createElement('span');
            let ySpan = document.createElement('span');

            xSpan.textContent += `x: ${num.toFixed(6)}`;
            ySpan.textContent += `y: ${resultY[i].toFixed(6)}`;
            ySpan.classList.add('cord-elem');
            xSpan.classList.add('cord-elem');

            cordBlock.append(xSpan, ySpan);
            cordBlock.classList.add('output-elem');

            cordOutput.append(cordBlock);
        });

        /* resultY.forEach(num => {
            let cordNum = document.createElement('div');
            cordNum.textContent += `y: ${num}\n`;
            yOutput.append(cordNum);
        }); */
    }

    btnCountLagrange.addEventListener('click', () => {
        //GettingData(defaultXCells, defaultYCells, genericXCells);
        MethodLagrenge(defaultXCells, defaultYCells);
        DrawGraph();
        SetValues();
    });

    btnCountSpline.addEventListener('click', () => {
        MethodSpline(defaultXCells, defaultYCells);
        DrawGraph();
        SetValues();
    });
});

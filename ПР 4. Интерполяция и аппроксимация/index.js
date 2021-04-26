"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const defaultDataTable = document.querySelector('#default-data_table');
    const genericDataTable = document.querySelector('#generic-data_table');
    const defaultXCells = defaultDataTable.querySelectorAll('#row-x .cell_input');
    const defaultYCells = defaultDataTable.querySelectorAll('#row-y .cell_input');
    const genericXCells = genericDataTable.querySelectorAll('#row-x .cell_input');
    //const genericYCells = genericDataTable.querySelectorAll('#polynom-result .output-cell');
    //const btnDrawGraph = document.querySelector('#btn_draw-graph');
    const btnCountPolynom = document.querySelector('#btn_count-polynom');

    let xCords = [];
    let yCords = [];
    let resultX = [];
    let resultY = [];
    let x;
    let step = 0.25;

    function compare(a, b) {
        if (a > b) return 1;
        if (a == b) return 0;
        if (a < b) return -1;
      }

    function MakeFragmentation(cordArray) {
        let a = +cordArray[0];
        let result = [a];

        do{
            a += step;
            result.push(a);

        }while(a < cordArray[cordArray.length - 1]);

        return result;
    }

    function GettingData(defaultCellsX, defaultCellsY, genericCellsX, genericCellsY) {
        let result;

        xCords = [];
        yCords = [];

        defaultCellsX.forEach(cell => {
            xCords.push(cell.value);
        });

        defaultCellsY.forEach(cell => {
            yCords.push(cell.value);
        });

        resultX = MakeFragmentation(xCords);
        result = GetFunctionY(resultX);
        resultY = result;
        

        if(genericCellsX[0].value !== "") {
            let genericX = [];
            let fragmentedX = []

            /* defaultCellsX.forEach(cell => {
                xCords.push(cell.value);
            });
    
            defaultCellsY.forEach(cell => {
                yCords.push(cell.value);
            }); */
    
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

            /*genericYCells.forEach((cell, i) => {
                cell.textContent = result[i].toFixed(5);
            });*/

            return;
        }
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

    /*btnDrawGraph.addEventListener('click', () => {
        GettingData(defaultXCells, defaultYCells);
        DrawGraph();
    });*/

    btnCountPolynom.addEventListener('click', () => {
        GettingData(defaultXCells, defaultYCells, genericXCells);
        DrawGraph();
    });
});

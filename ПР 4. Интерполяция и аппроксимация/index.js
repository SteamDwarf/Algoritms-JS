"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const defaultDataTable = document.querySelector('#default-data_table');
    const genericDataTable = document.querySelector('#generic-data_table');
    const defaultXCells = defaultDataTable.querySelectorAll('#row-x .cell_input');
    const defaultYCells = defaultDataTable.querySelectorAll('#row-y .cell_input');
    const genericXCells = genericDataTable.querySelectorAll('#row-x .cell_input');
    const genericYCells = genericDataTable.querySelectorAll('#polynom-result .output-cell');
    const btnDrawGraph = document.querySelector('#btn_draw-graph');
    const btnCountPolynom = document.querySelector('#btn_count-polynom');

    let xCords = [];
    let yCords = [];
    let x;

    /*let xCords = [2, 3, 4, 5, 6];
    let yCords = [0.4, 0.55, 0.13, 0.09, 0.07];
    let x = 10;*/
    /*let xCords = [2, 5, -6, 7, 4, 3, 8, 9, 1, -2];
    let yCords = [-1, 77, -297, 249, 33, 9, 389, 573, -3, -21];
    let x = 7;*/
    /*let xCords = [1.3, 2.1, 3.7, 4.5, 6.1, 7.7, 8.5];
    let yCords = [1.7777, 4.5634, 13.8436, 20.3952, 37.33872, 59.4051, 72.35931 ];
    let x = 1.5674;*/

    function compare(a, b) {
        if (a > b) return 1;
        if (a == b) return 0;
        if (a < b) return -1;
      }

    function GettingData(defaultCellsX, defaultCellsY, genericCellsX, genericCellsY) {
        xCords = [];
        yCords = [];

        if(genericCellsX && genericCellsY) {
            let genericX = [];

            defaultCellsX.forEach(cell => {
                xCords.push(cell.value);
            });
    
            defaultCellsY.forEach(cell => {
                yCords.push(cell.value);
            });
    
            genericCellsX.forEach(cell => {
                if(cell.value !== '') {
                    genericX.push(cell.value);
                }
            });

            //genericX.sort(compare);
            let result = GetFunctionY(genericX);

            genericX.forEach(num => {
                xCords.push(num);
            });

            result.forEach((num, i) => {
                yCords.push(num);
                genericYCells[i].textContent = num.toFixed(5);
            });

            /*genericYCells.forEach((cell, i) => {
                cell.textContent = result[i].toFixed(5);
            });*/

            return;
        }

        
        defaultCellsX.forEach(cell => {
            xCords.push(cell.value);
        });

        defaultCellsY.forEach(cell => {
            yCords.push(cell.value);
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
            data.addRows(xCords.length);

            for (let i = 0; i < xCords.length; i++) {
                data.setCell(i, 0, xCords[i]);
                data.setCell(i, 1, yCords[i]);
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

    btnDrawGraph.addEventListener('click', () => {
        GettingData(defaultXCells, defaultYCells);
        DrawGraph();
    });

    btnCountPolynom.addEventListener('click', () => {
        GettingData(defaultXCells, defaultYCells, genericXCells, genericYCells);
        DrawGraph();
    });

   //GetFunctionY();
   //lineDraw();
});

//-4 * (-1.5) * (-0.6) * (-0.25)
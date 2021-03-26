"use strict"

document.addEventListener("DOMContentLoaded", () => {

    let yCordinates = [],
        xTrueCordinates = [], 
        step = 0.5,
        x, a = -4, b = -2,
        xCordinates = [a],
        expression = '3*x*Math.sin(x)-1',
        derivativeFirst = '3*Math.sin(x) + 3*x*Math.cos(x)';
/*         expression2 = '2^x-2*(x^2)+1',
        expression3 = 'x*2^x-1'; */


   /*  function createCordinates() {
        createNewX();
        findingA_B();
        xCordinates = [a];
        //console.log(xCordinates);
        createNewX();
        //console.log(xCordinates);
        yCordinates = [];
        xCordinates.forEach(num => {
            x = num;
            yCordinates.push(eval(expression)); 
        });
        console.log(yCordinates);
        //console.log(a, b);
        //console.log(Math.abs((a - b) / step));
        lineDraw();
    }

    function createNewX() {
        if(!a && !b) {
            for(let i = 0; i < 30; i++) {
                xCordinates.push(xCordinates[i] + step);
            }
        }else {
            for(let i = 0; i < Math.abs((a - b) / step); i++) {
                xCordinates.push(xCordinates[i] + step);
            }
            
        }
        
        //console.log(xCordinates); 
    }

    function findingA_B() {
        xCordinates.forEach(num => {
            x = num;
            let y = eval(expression); 
            if(y < 1 && y > -1) {
                xTrueCordinates.push(num);
                yCordinates.push(y);
            }
           
        });
        //console.log(yCordinates);
        a = (Math.min.apply(null, yCordinates));
        b = (Math.max.apply(null, yCordinates));
        //console.log(a, b);
    }
 */

    function createX() {
        for(let i = 0; i <Math.abs((b - a) / step); i++) {
            xCordinates.push(xCordinates[i] + step);
        }
        console.log(xCordinates);
    }

    function createY() {
        xCordinates.forEach(num => {
            x = num;
            yCordinates.push(eval(expression));
        });
        console.log(yCordinates);
    }

    function lineDraw() {

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const data = new google.visualization.DataTable();
            
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(yCordinates.length);

            for (let i = 0; i < yCordinates.length; i++) {
                data.setCell(i, 0, xCordinates[i]);
                data.setCell(i, 1, yCordinates[i]);
            }

            let options = {
            title: 'Интегрирование функции методом Симпсона',
            curveType: 'function',
            legend: 'none'
            }; 

            let chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }
    }
    
    //createCordinates();
    createX();
    createY();
    lineDraw();
});










"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const aInput = document.querySelector('[name="a-cordinate"]'),
          bInput = document.querySelector('[name="b-cordinate"]'),
          outputBlock = document.querySelector('.output_block'),
          btnCountNuton = document.querySelector('#Nuton_btn'),
          btnCountDichotomy = document.querySelector('#Dichotomy_btn'),
          iterationOutput = document.querySelector('.iteration_output'),
          resOutput = document.querySelector('.res_output'),
          errorOutput = document.querySelector('.error_output');
          
    let a, b, 
        step = 0.5,
        eps = 0.00001,     
        xCordinatesChart = [],
        yCordinatesChart = [],
        xApproximateCordinates = [],
        yApproximateCordinates = [],
        x, y, yDeriv,
        k = 0,   
/*         expression4 = '3*x*Math.sin(x)-1',
        derivativeFirst4 = '3*Math.sin(x) + 3*x*Math.cos(x)'; */
/*         expression4 = 'x**3+4*x-3', //Это работает
        derivativeFirst4 = '4*x-7',
        derivativeSecond4 = '4'; */
        expression4 = '2*(x**2)-7*x+2',
        derivativeFirst4 = '4*x-7',
        derivativeSecond4 = '4';
/*         expression4 = '2**x-2*(x**2)+1',
        derivativeFirst4 = '2**x*Math.log(2)-4*x'; */
       /*  expression3 = 'x*2**x-1'; */

    function lineDraw() {

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const data = new google.visualization.DataTable();
            
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(yCordinatesChart.length);

            for (let i = 0; i < yCordinatesChart.length; i++) {
                data.setCell(i, 0, xCordinatesChart[i]);
                data.setCell(i, 1, yCordinatesChart[i]);
            }

            let options = {
            title: 'Интегрирование функции методом Симпсона',
            curveType: 'function',
            legend: 'none'
            }; 

            let chart = new google.visualization.LineChart(document.querySelector('#curve_chart'));

            chart.draw(data, options);
        }
    }

    function refresh() {
        a = ''; 
        b = '';
        k = 0;
        step = 0.5;
        eps = 0.00001;    
        xCordinatesChart = [];
        yCordinatesChart = [];
        xApproximateCordinates = [];
        yApproximateCordinates = [];
        x = null;
        y = null; 
        yDeriv = null;   
    }

    function createChartCordinates() {
        xCordinatesChart = [a];
        for(let i = 0; i < Math.abs((a - b) / step); i++) {
            xCordinatesChart.push(xCordinatesChart[i] + step);
        }
        xCordinatesChart.forEach(num => {
            x = num;
            let y = eval(expression4);
            yCordinatesChart.push(y);
        //console.log(xCordinatesChart); 
        });
    }

    function findingApproximate() {
        yCordinatesChart.forEach((num, i) => {
            if(num < 1 && num > -1) {
                xApproximateCordinates.push(xCordinatesChart[i]);
                yApproximateCordinates.push(yCordinatesChart[i]);
            }  
        });
        if(yApproximateCordinates.length < 1 && step < 0.2) {
            alert('В этом промежутке нет корней данного уранвения');
            
        } else if(yApproximateCordinates.length < 1 && step > 0.2) {
            yCordinatesChart = [];
            xApproximateCordinates = [];
            yApproximateCordinates = [];
            xCordinatesChart = [-5];
            step /= 2;
            createCordinates();
            findingApproximate();
        }
        //console.log(yCordinatesChart);
        //console.log(a, b);
        //console.log(xApproximateCordinates);
        //console.log(yApproximateCordinates);
    }
    
    function createCordinates() {
        createChartCordinates();
        lineDraw();
    }

    function createAproximateCordinates(i) {
        x = xApproximateCordinates[i];
        y = yApproximateCordinates[i];
        yDeriv = eval(derivativeFirst4);
        console.log(x, y, yDeriv);
    }

    function iterationNuton() { 
        do {
            let newX = x - y / yDeriv;
            x = newX;
            y = eval(expression4);
            yDeriv = eval(derivativeFirst4);
            k++;
        } while(Math.abs(y) > eps);
        //console.log(x, y, yDeriv);
    }

    function methodNuton() {
        a = +aInput.value;
        b = +bInput.value;
        createCordinates();
        findingApproximate();
        xApproximateCordinates.forEach((num, i) => {
            createAproximateCordinates(i);
            iterationNuton();
        });
    }


    function makeSegmentation(yArray) {
        let c = (a + b) / 2;
        x = c;
        y = eval(expression4);

        if(yArray[0] * y > 0) {
            a = x;
            yArray[0] = y;
        } else {
            b = x;
            yArray[1] = y;
        }
    }

    function methodDichotomy() {
        a = +aInput.value;
        b = +bInput.value;
        createCordinates();
        let ySegment = [yCordinatesChart[0], yCordinatesChart[yCordinatesChart.length - 1]];
        
        do {
            makeSegmentation(ySegment);
            k++;
        }while(Math.abs(y) > eps);
    }

    btnCountNuton.addEventListener('click', () => {
        refresh();
        methodNuton();
        iterationOutput.textContent = k;
        resOutput.textContent = x;
        errorOutput.textContent = y;
    });

    btnCountDichotomy.addEventListener('click', () => {
        refresh();
        methodDichotomy();
        iterationOutput.textContent = k;
        resOutput.textContent = x;
        errorOutput.textContent = y;
    });
/*     createX();
    createY(); */
    //lineDraw();
});










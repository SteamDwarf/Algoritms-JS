"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const blockNDProgramm = document.querySelector('.ND_block'),
          blockNJProgramm = document.querySelector('.NJ_block'),
          functionElements = document.querySelectorAll('.function_list li'),
          aInput = document.querySelector('[name="a-cordinate"]'),
          bInput = document.querySelector('[name="b-cordinate"]'),
          funcInput = document.querySelector('.func_input'),
          outputBlock = document.querySelector('.output_block'),
          btnCountNuton = document.querySelector('#Nuton_btn'),
          btnCountDichotomy = document.querySelector('#Dichotomy_btn'),
          iterationOutput = document.querySelector('.iteration_output'),
          resOutput = document.querySelector('.res_output'),
          errorOutput = document.querySelector('.error_output'),
          btnNDProgramm = document.querySelector('#ND_btn'),
          btnNJProgramm = document.querySelector('#NJ_btn');
          
    let a, b, 
        step = 0.5,
        eps = 0.00001,     
        xCordinatesChart = [],
        yCordinatesChart = [],
        xApproximateCordinates = [],
        yApproximateCordinates = [],
        x, y, yDeriv,
        k = 0,
        expression,
        derivativeFirst,
        derivativeSecond;

    const expressions = {
        '3xsin(x) - 1': {
            exp: '3*x*Math.sin(x)-1',
            deriv: '3*Math.sin(x) + 3*x*Math.cos(x)',
            derivSecond: '3*(2*Math.cos(x) - x*Math.sin(x))'
        },
        '2x^2 - 7x + 2': {
            exp: '2*(x**2)-7*x+2',
            deriv: '4*x-7',
            derivSecond: '4'
        },
        '2^x - 2x^2 + 1': {
            exp: '2**x-2*(x**2)+1',
            deriv: '2**x*Math.log(2)-4*x',
            derivSecond: '(Math.log(2))**2*2**x-4'
        }
    };

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
            curveType: 'function',
            legend: 'none'
            }; 

            let chart = new google.visualization.LineChart(document.querySelector('#curve_chart'));

            chart.draw(data, options);
        }
    }

    function expressionChoose() {
        let chosenFunction = funcInput.textContent;

        for(let key in expressions) {
            if(chosenFunction === key) {
                expression = expressions[key].exp;
                derivativeFirst = expressions[key].deriv;
                derivativeSecond = expressions[key].derivSecond;
            }
        }

        console.log(expression, derivativeFirst);
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
        resOutput.textContent = '';
        iterationOutput.textContent = '';
        errorOutput.textContent = ''; 
    }

    function createChartCordinates() {
        xCordinatesChart = [a];
        for(let i = 0; i < Math.abs((a - b) / step); i++) {
            xCordinatesChart.push(xCordinatesChart[i] + step);
        }
        xCordinatesChart.forEach(num => {
            x = num;
            let y = eval(expression);
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
        x = a;
        yDeriv = eval(derivativeSecond);

        if(yDeriv * yCordinatesChart[0] > 0) {
            y = yCordinatesChart[0];
            yDeriv = eval(derivativeFirst);
        } else {
            x = b;
            y = yCordinatesChart[xCordinatesChart.length - 1];
            yDeriv = eval(derivativeFirst);
        }
    }

    function iterationNewton() { 
        do {
            let newX = x - y / yDeriv;
            x = newX;
            y = eval(expression);
            yDeriv = eval(derivativeFirst);
            k++;
        } while(Math.abs(y) > eps);
        let rootElem = document.createElement('div');
        rootElem.textContent = x;
        resOutput.append(rootElem);
        console.log(k);
    }

    function methodNewton() {
        a = +aInput.value;
        b = +bInput.value;
        createCordinates();
        createAproximateCordinates();
        iterationNewton();
    }


    function makeSegmentation(yArray) {
        let c = (a + b) / 2;
        x = c;
        y = eval(expression);

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
            if(k > 100) {
                alert('В этом промежутке нет корней');
                break;
            }
        }while(Math.abs(y) > eps);
    }

    btnNDProgramm.addEventListener('click', () => {
        blockNDProgramm.style.display = 'flex';
        blockNJProgramm.style.display = 'none';
    });

    btnNJProgramm.addEventListener('click', () => {
        blockNDProgramm.style.display = 'none';
        blockNJProgramm.style.display = 'flex';
    });

    functionElements.forEach(element => {
        element.addEventListener('click', ()=> {
            funcInput.textContent = element.textContent;
            expressionChoose();
        });
    });

    btnCountNuton.addEventListener('click', () => {
        refresh();
        methodNewton();
        iterationOutput.textContent = k;
        //resOutput.textContent = x;
        errorOutput.textContent = y;
    });

    btnCountDichotomy.addEventListener('click', () => {
        refresh();
        methodDichotomy();
        iterationOutput.textContent = k;
        resOutput.textContent = x;
        errorOutput.textContent = y;
    });

});

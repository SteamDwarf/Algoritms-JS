"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const blockNDProgramm = document.querySelector('.ND_block');
    const blockNJProgramm = document.querySelector('.NJ_block');
    const functionElements = document.querySelectorAll('.function_list li');
    const aInput = document.querySelector('[name="a-cordinate"]');
    const bInput = document.querySelector('[name="b-cordinate"]');
    const funcInput = document.querySelector('.func_input');
    const outputBlock = document.querySelector('.output_block');
    const btnCountNuton = document.querySelector('#Nuton_btn');
    const btnCountDichotomy = document.querySelector('#Dichotomy_btn');
    const iterationOutput = document.querySelector('.iteration_output');
    const resOutput = document.querySelector('.res_output');
    const errorOutput = document.querySelector('.error_output');
    const btnNDProgramm = document.querySelector('#ND_btn');
    const btnNJProgramm = document.querySelector('#NJ_btn');
          
    const eps = 0.00001;     
    const expressions = {
        '3xsin(x) - 1': {
            exp: '3*x*Math.sin(x)-1',
            deriv: '3*Math.sin(x) + 3*x*Math.cos(x)',
        },
        '2x^2 - 7x + 2': {
            exp: '2*(x**2)-7*x+2',
            deriv: '4*x-7',
        },
        '2^x - 2x^2 + 1': {
            exp: '2**x-2*(x**2)+1',
            deriv: '2**x*Math.log(2)-4*x',
        }
    };

    let a, b, expression, derivativeFirst, x, y, yReserv, yDeriv;
    let step = 0.5;
    let xCordinatesChart = [];
    let yCordinatesChart = [];
    let xApproximateCordinates = [];
    let yApproximateCordinates = [];
    let k = 0;

    function lineDraw() {

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const data = new google.visualization.DataTable();

            let options = {
                curveType: 'function',
                legend: 'none'
                }; 
            let chart = new google.visualization.LineChart(document.querySelector('#curve_chart'));
            
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(yCordinatesChart.length);

            for (let i = 0; i < yCordinatesChart.length; i++) {
                data.setCell(i, 0, xCordinatesChart[i]);
                data.setCell(i, 1, yCordinatesChart[i]);
            }

            chart.draw(data, options);
        }
    }

    function expressionChoose() {
        let chosenFunction = funcInput.textContent;

        for(let key in expressions) {
            if(chosenFunction === key) {
                expression = expressions[key].exp;
                derivativeFirst = expressions[key].deriv;
            }
        }
    }

    function refresh() {
        a = ''; 
        b = '';
        k = 0;
        step = 0.5;
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
            y = eval(expression);
            yCordinatesChart.push(y);
        });
    }

    function findingApproximate() {
        let minCord;
        yCordinatesChart.forEach((num, i) => {
            if(i === 0) {
                yReserv = num;
            } else {
                if(num * yReserv < 0) {
                    minCord = Math.min(Math.abs(num), Math.abs(yReserv));
                    yApproximateCordinates.push(minCord);
                    xApproximateCordinates.push(xCordinatesChart[i]);
                }
                yReserv = num;
            }
        });
    }
    
    function createCordinates() {
        createChartCordinates();
        lineDraw();
    }

    function iterationNewton() { 
        yApproximateCordinates.forEach((num, i) => {
            let rootElem = document.createElement('div');

            y = num;
            x =  xApproximateCordinates[i];
            yDeriv = eval(derivativeFirst);

            do {
                let newX = x - y / yDeriv;
                x = newX;
                y = eval(expression);
                yDeriv = eval(derivativeFirst);
                k++;
            } while(Math.abs(y) > eps);

            rootElem.textContent = x;
            resOutput.append(rootElem);
        });
    }

    function methodNewton() {
        a = +aInput.value;
        b = +bInput.value;
        createCordinates();
        findingApproximate();
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
        let ySegment;

        a = +aInput.value;
        b = +bInput.value;
        createCordinates();

        ySegment = [yCordinatesChart[0], yCordinatesChart[yCordinatesChart.length - 1]];
        
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
        errorOutput.textContent = Math.abs(y);
    });

    btnCountDichotomy.addEventListener('click', () => {
        refresh();
        methodDichotomy();
        iterationOutput.textContent = k;
        resOutput.textContent = x;
        errorOutput.textContent = Math.abs(y);
    });

});

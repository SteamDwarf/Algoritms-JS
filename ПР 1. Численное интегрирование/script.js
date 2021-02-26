"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const aInput = document.querySelector('[name="a-cordinate"]'),
          bInput = document.querySelector('[name="b-cordinate"]'),
          btnSimpson = document.querySelector('#btn-Simpson'),
          btnMonteCarlo = document.querySelector('#btn-MonteCarlo'),
          funcInput = document.querySelector('[name="function-input"]'),
          fragmentInput = document.querySelector('[name="fragmentation-input"]'),
          dotsInput = document.querySelector('[name="dots-input"]'),
          resOutput = document.querySelector('.res_output'),
          errorOutput = document.querySelector('.error_output'),
          fargmOutput = document.querySelector('.fragm_output'),
          functionList = document.querySelector('.function_list');

    let a, b, cordinatesX, cordinatesY;

    function lineDraw() {

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const data = new google.visualization.DataTable();
            
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(cordinatesY.length);

            for (let i = 0; i < cordinatesY.length; i++) {
                data.setCell(i, 0, cordinatesX[i]);
                data.setCell(i, 1, cordinatesY[i]);
            }

            var options = {
            title: 'Интегрирование функции методом Симпсона',
            curveType: 'function',
            legend: 'none'
            }; 

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }
    }

    function funcExpressionReplace(x) {
        let functionExpression = ' ' + funcInput.value,
            expressions = {
                ln: ' Math.log',
                '\ cos': ' Math.cos',
                '\ sin': ' Math.sin',
                tg: ' Math.tan',
                '\\^': '**',
                sqrt: ' Math.sqrt',
                arct: ' Math.atan',
                arccos: ' Math.acos',
                arcsin: ' Math.asin',
                'x': x,
                e: Math.E
            };

        for(let key in expressions) {
            let reg = new RegExp(key,'g');
            functionExpression = functionExpression.replace(reg, expressions[key]);
        }
        return eval(functionExpression);
    }

    function makeFragmentation(k, fragm) {
        let h, n;

        if(fragm === '') {
            let maxH = 0.001 ** (1/4);
            n = Math.ceil((b - a) / maxH);
            n % 2 !== 0 ? ++n : n;
            n *= k;   
            h = ((b - a) / n);
        } else {
            n = k * fragm;   
            h = ((b - a) / n);
        }

        return [h, n];
    }

    function setXY(n, h) {    
        cordinatesX = [a];
        cordinatesY = []; 
        for(let i = 0; i < n; i++) {
            cordinatesX.push(cordinatesX[i] + h);
        }
    
        cordinatesX.forEach(x => {
            cordinatesY.push(funcExpressionReplace(x));
        });

        return cordinatesY;
    } 

    function integralSimpsonCount() {
        
        function integral(cordinatesY, h) {
            let amountY = cordinatesY.length,
                sumY = 0,
                sumOddY = 0,
                sumEvenY = 0;
        
            for(let i = 1; i < amountY; i += 2) {
                sumY += cordinatesY[i];
            }
            sumOddY = 4 * sumY;
            sumY = 0;
            
            for(let i = 2; i < amountY - 1; i += 2) {
                sumY += cordinatesY[i];
            }
            sumEvenY = 2 * sumY;
        
            let integral = h / 3 * (cordinatesY[0] + cordinatesY[amountY - 1] + sumEvenY + sumOddY);
        
            return integral;
        }
        
        function getResult() {
            let fragm = fragmentInput.value,
                h = makeFragmentation(1, fragm)[0],
                n = makeFragmentation(1, fragm)[1],
                h2 = makeFragmentation(2, fragm)[0],
                n2 = makeFragmentation(2, fragm)[1],
                cordinatesYn = setXY(n, h),
                cordinatesY2n = setXY(n2, h2), 
                integralSimpsonN = integral(cordinatesYn, h),
                integralSimpson2N = integral(cordinatesY2n, h2),
                errorRunge = Math.abs(integralSimpson2N - integralSimpsonN) / 15;
            
            resOutput.textContent = integralSimpsonN;
            errorOutput.textContent = errorRunge;
            fargmOutput.textContent = n;
        }
        
        getResult();
    }

    function drawDots(funcX, funcY, notfuncX, notfuncY, dots) {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        const data = new google.visualization.DataTable();
        let j = 0;
            
        data.addColumn('number', 'x');
        data.addColumn('number', 'yFunc');
        data.addColumn('number', 'yNotFunc');
        data.addRows(dots);

        for (let i = 0; i < funcX.length; i++) {
            data.setCell(j, 0, funcX[i]);
            data.setCell(j, 1, funcY[i]);
            j++;
        }
        for (let i = 0; i < notfuncX.length; i++) {
            data.setCell(j, 0, notfuncX[i]);
            data.setCell(j, 2, notfuncY[i]);
            j++;
        }

        var chart = new google.visualization.ScatterChart(document.getElementById('curve_chart'));

        chart.draw(data);
      }
    }

    function integralMonteCarloCount(dots) {

        let fragm = fragmentInput.value,
            h = makeFragmentation(1, fragm)[0],
            n = makeFragmentation(1, fragm)[1],
            width = Math.abs(b - a),
            cordinatesYn = setXY(n, h),
            yMin = Math.min.apply(0, cordinatesYn),
            yMax = Math.max.apply(0, cordinatesYn),
            height,
            square,
            sumRes = 0,
            sumSquareRes = 0;


            if(yMin >= 0 && yMax > 0) {
                height = yMax + yMin;
            } else if(yMax > 0 && yMin < 0) {
                height = yMax + Math.abs(yMin);
            } else {
                height = Math.abs(yMin);
            }

            square = width * height;
        
        function countIntegral(yMin, yMax) {
            let randX = [],
                randY = [],
                trueY = [],
                funcY = [],
                notfuncY = [],
                funcX = [], 
                notfuncX = [];

            for(let i = 0; i < dots; i++) {
                randX.push(Math.random() * width + a);
            }
            for(let i = 0; i < dots; i++) {
                randY.push(Math.random() * height - Math.abs(yMin));
            }

            randX.forEach(x => {
                trueY.push(funcExpressionReplace(x));
            });

            trueY.forEach((y, i) => {
                if(y > 0 && randY[i] < y && randY[i] > 0) {
                    funcY.push(randY[i]);
                    funcX.push(randX[i]);
                } else if(y < 0 && randY[i] > y && randY[i] < 0) {
                    funcY.push(randY[i]);
                    funcX.push(randX[i]);
                } else {
                    notfuncY.push(randY[i]);
                    notfuncX.push(randX[i]);
                }
            });
            
            let proportion = funcY.length / dots,
                result = proportion * square;

            sumRes += result;
            sumSquareRes += result ** 2;

            resOutput.textContent = result;

            drawDots(funcX, funcY, notfuncX, notfuncY, dots);
        }

        function countErrorMonteCarlo() {
            for(let i = 0; i < 10; i++) {
                countIntegral(yMin, yMax);
            }

            console.log(sumRes**2, sumSquareRes);
            let error = Math.sqrt((sumSquareRes) / 10  - (sumRes /10) ** 2);
            errorOutput.textContent = error;
        }

        countErrorMonteCarlo();
    }

    functionList.addEventListener('click', (e) => {
        funcInput.value = e.target.textContent;
    });

    btnSimpson.addEventListener('click', () => {
        a = +aInput.value;
        b = +bInput.value;

        btnSimpson.style.cssText = 'border: solid 2px #4A90E2';

        integralSimpsonCount();
        lineDraw();
    });

    btnMonteCarlo.addEventListener('click', () => {
        a = +aInput.value;
        b = +bInput.value;
        integralMonteCarloCount(+dotsInput.value);
    });
    
});









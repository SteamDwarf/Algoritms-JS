"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const aInput = document.querySelector('[name="a-cordinate"]'),
          bInput = document.querySelector('[name="b-cordinate"]'),
          btnSimpson = document.querySelector('.btn-Simpson'),
          funcInput = document.querySelector('[name="function-input"]'),
          fragmentInput = document.querySelector('[name="fragmentation-input"]'),
          resOutput = document.querySelector('.res_output'),
          errorOutput = document.querySelector('.error_output'),
          fargmOutput = document.querySelector('.fragm_output'),
          functionList = document.querySelector('.function_list');

    let a, b, cordinatesX, cordinatesY;

    function graphDraw() {

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
                'x': x
            };

        for(let key in expressions) {
            let reg = new RegExp(key,'g');
            functionExpression = functionExpression.replace(reg, expressions[key]);
        }
        return eval(functionExpression);
    }

    function integralCount() {

        function setHN(k, fragm) {
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
            
            console.log(h, n);
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
        
            console.log(cordinatesX, cordinatesY);
            return cordinatesY;
        } 
        
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
        
        function Runge() {
            let fragm = fragmentInput.value,
                h = setHN(1, fragm)[0],
                n = setHN(1, fragm)[1],
                h2 = setHN(2, fragm)[0],
                n2 = setHN(2, fragm)[1],
                cordinatesYn = setXY(n, h),
                cordinatesY2n = setXY(n2, h2), 
                integralSimpsonN = integral(cordinatesYn, h),
                integralSimpson2N = integral(cordinatesY2n, h2),
                errorRunge = Math.abs(integralSimpson2N - integralSimpsonN) / 15;
            
            resOutput.textContent = integralSimpsonN;
            errorOutput.textContent = errorRunge;
            fargmOutput.textContent = n;
        }
        
        Runge();
    }

    functionList.addEventListener('click', (e) => {
        funcInput.value = e.target.textContent;
    });

    btnSimpson.addEventListener('click', () => {
        a = +aInput.value;
        b = +bInput.value;

        btnSimpson.style.cssText = 'border: solid 2px #4A90E2';

        integralCount();
        graphDraw();
    });

    
});









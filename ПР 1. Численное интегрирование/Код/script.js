"use strict"

document.addEventListener("DOMContentLoaded", () => {

    const aInput = document.querySelector('[name="a-cordinate"]'),
          bInput = document.querySelector('[name="b-cordinate"]'),
          functionChart = document.querySelector('#curve_chart'),
          btnSimpson = document.querySelector('#btn-Simpson'),
          btnMonteCarlo = document.querySelector('#btn-MonteCarlo'),
          funcInput = document.querySelector('[name="function-input"]'),
          fragmentInput = document.querySelector('[name="fragmentation-input"]'),
          dotsInput = document.querySelector('[name="dots-input"]'),
          resOutput = document.querySelector('.res_output'),
          errorOutput = document.querySelector('.error_output'),
          fargmOutput = document.querySelector('.fragm_output'),
          functionList = document.querySelector('.function_list'),
          modalInstruction = document.querySelector('.modal'),
          btnInstruction = document.querySelector('#btn-instruction');

    let a, b, cordinatesX, cordinatesY;

    function showInstruction() {
        modalInstruction.style.display = 'block';
    }

    function closeInstruction(e) {
        if (e.target === modalInstruction|| e.target.parentNode.className === 'modal_close') {
            modalInstruction.style.display = 'none';
        }
    }

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

            let options = {
            title: 'Интегрирование функции методом Симпсона',
            curveType: 'function',
            legend: 'none'
            }; 

            let chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }
    }

    function funcExpressionReplace(x) {
        let functionExpression = ' ' + funcInput.value,
            expressions = {
                ln: ' Math.log',
                '\ cos': ' Math.cos',
                '\ sin': ' Math.sin',
                '\ tg': ' Math.tan',
                '\\^': '**',
                sqrt: ' Math.sqrt',
                arctg: ' Math.atan',
                arccos: ' Math.acos',
                arcsin: ' Math.asin',
                'x': x,
                e: Math.E,
                pi: Math.PI
            };

        for(let key in expressions) {
            let reg = new RegExp(key,'g');
            functionExpression = functionExpression.replace(reg, expressions[key]);
        }
        
        let res;
        try {
            res = eval(functionExpression);
        }catch(e) {
            res = 'error';
        } finally {
            return res;
        }
    }

    function makeFragmentation(k, fragm) {
        let h, n;

        if(fragm === '') {
            let maxH = 0.0001 ** (1/4);
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
    
        if(funcExpressionReplace(1) === 'error') {
            return 'error';
        } else {
            cordinatesX.forEach(x => {
                cordinatesY.push(funcExpressionReplace(x));
            });
    
            return cordinatesY;
        }
    } 

    function integralSimpsonCount() {
        let fragm = fragmentInput.value,
            h = makeFragmentation(1, fragm)[0],
            n = makeFragmentation(1, fragm)[1],
            h2 = makeFragmentation(2, fragm)[0],
            n2 = makeFragmentation(2, fragm)[1];

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
            let cordinatesYn = setXY(n, h),
                cordinatesY2n = setXY(n2, h2), 
                integralSimpsonN = integral(cordinatesYn, h),
                integralSimpson2N = integral(cordinatesY2n, h2),
                errorRunge = Math.abs(integralSimpson2N - integralSimpsonN) / 15;
                
            resOutput.textContent = integralSimpsonN;
            errorOutput.textContent = errorRunge;
            fargmOutput.textContent = n;
        }

        if(setXY(n, h) === 'error') {
            alert('Вы неправильно ввели функцию, прочтите указания или попробуйте еще раз.');

            functionChart.textContent = '';
            resOutput.textContent = '';
            errorOutput.textContent = '';
            fargmOutput.textContent = '';

        } else {
            getResult();
            lineDraw();
        }
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

        let options = {
            title: 'Интегрирование функции методом Монте-Карло',
        }; 

        let chart = new google.visualization.ScatterChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
    }

    function integralMonteCarloCount(dots) {

        if(!dots) {
            alert('Введите количество точек!');

            functionChart.textContent = '';
            resOutput.textContent = '';
            fargmOutput.textContent = '';
            errorOutput.textContent = '';

            return undefined;
        }

        let fragm = fragmentInput.value,
            h = makeFragmentation(1, fragm)[0],
            n = makeFragmentation(1, fragm)[1],
            width = Math.abs(b - a),
            height, yMin, yMax,
            square,
            sumRes = 0,
            sumSquareRes = 0;
              
        function countIntegral() {
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
                countIntegral();
            }

            let error = Math.sqrt((sumSquareRes) / 10  - (sumRes /10) ** 2);
            fargmOutput.textContent = '';
            errorOutput.textContent = error;
        }


        if(setXY(n, h) === 'error') {
            alert('Вы неправильно ввели функцию, прочтите указания или попробуйте еще раз.');

            functionChart.textContent = '';
            resOutput.textContent = '';
            fargmOutput.textContent = '';
            errorOutput.textContent = '';

        } else {
            let cordinatesYn = setXY(n, h);
            yMin = Math.min.apply(0, cordinatesYn);
            yMax = Math.max.apply(0, cordinatesYn);

            if(yMin >= 0 && yMax > 0) {
                height = yMax + yMin;
            } else if(yMax > 0 && yMin < 0) {
                height = yMax + Math.abs(yMin);
            } else {
                height = Math.abs(yMin);
            }

            square = width * height;

            countErrorMonteCarlo();
        }

    }

    btnInstruction.addEventListener('click', () => {
        showInstruction();
    });

    modalInstruction.addEventListener('click', (e) => {
        closeInstruction(e);
    });

    functionList.addEventListener('click', (e) => {
        funcInput.value = e.target.textContent;
    });

    btnSimpson.addEventListener('click', () => {
        a = +aInput.value;
        b = +bInput.value;

        btnSimpson.style.cssText = 'border: solid 2px #4A90E2';
        btnMonteCarlo.style.cssText = 'none';

        integralSimpsonCount();
    });

    btnMonteCarlo.addEventListener('click', () => {
        a = +aInput.value;
        b = +bInput.value;

        btnSimpson.style.cssText = 'none';
        btnMonteCarlo.style.cssText = 'border: solid 2px #4A90E2';

        integralMonteCarloCount(+dotsInput.value);
    });
    
});









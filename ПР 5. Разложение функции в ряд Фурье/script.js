'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const functionExamplesImgs = document.querySelectorAll('.img-func');
    const beginSectionInput = document.querySelector('[name="a-cordinate"]');
    const endSectionInput = document.querySelector('[name="b-cordinate"]');
    const partNumberInput = document.querySelector('.part_input');
    const btnDecompose = document.querySelector('#decompose_btn');

    const functionExamples = {
        func1: {
            exp: (x) => x + 1,
            valueT: Math.PI,
            name: 'x+1'
        },
        func2: {
            exp: (x) => Math.asin(Math.sin(x)),
            valueT: Math.PI,
            name: 'arcsin(sin(x))'
        },
        func3: {
            exp: (x) => Math.sign(Math.sin(x)),
            valueT: 2 * Math.PI,
            name: 'sign(sin(x))'
        },
        func4: {
            exp: (x) => x * Math.abs(x),
            valueT: Math.PI,
            name: 'x*|x|'
        },
        func5: {
            exp: (x) => Math.sinh(Math.sin(x)),
            valueT: 0.2 * Math.PI,
            name: 'sh(sin(x))'
        },
        func6: {
            exp: (x) => Math.E ** x,
            valueT: Math.PI,
            name: 'e^x'
        },
        func7: {
            exp: (x) => Math.abs(x),
            valueT: 2,
            name: '|x|'
        }
    };

    //let func = (x) => x**2;
    //const func = (x) => Math.sin(x);
    
    //const func = (x) => Math.sin(x)**4;
    //const func = (x) => 2 / (x + 0.1);
    //const func = (x) => Math.E ** x;
    //const func = (x) => Math.asin(Math.sin(x));
    //const func = (x) => x * Math.abs(x);
    //const func = (x) => Math.abs(x);
    //const func = (x) => Math.sinh(Math.sin(x));
    //const func = (x) => Math.sign(Math.sin(x));

    let func = (x) => x + 1;
    const funcMcos = (x) => func(x) * Math.cos(x * ik);
    const funcMsin = (x) => func(x) * Math.sin(x * ik);

    let cordinatesX;
    let cordinatesY;
    let cordinatesXF;
    let cordinatesYF;
    let A0k;
    let AkArray;
    let BkArray;
    let T;
    let funcName;
    //let T = Math.PI;
    //let T = 0.2 * Math.PI;
    //let T = 2;
    //let T = 2*Math.PI;
    let a; 
    let b;
    let c = -10;
    let d = 10;
    let k = 200;
    let ik = 0;
    let step = 0.01;
    let curFunc = func;

    function GetFragmentation(k, fragm) {
        let h, n;

        if(fragm === 0) {
            let maxH = 0.000000001 ** (1/4);

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

    function SetXY(n, h) {    
        cordinatesX = [a];
        cordinatesY = []; 
        for(let i = 0; i < n; i++) {
            cordinatesX.push(cordinatesX[i] + h);
        }
    
        cordinatesX.forEach(x => {
            cordinatesY.push(curFunc(x));
        });
    
        return cordinatesY;
    } 

    function Integral(cordinatesY, h) {
        let amountY = cordinatesY.length;
        let sumY = 0;
        let sumOddY = 0;
        let sumEvenY = 0;
        let integral;
    
        for(let i = 1; i < amountY; i += 2) {
            sumY += cordinatesY[i];
        }
        sumOddY = 4 * sumY;
        sumY = 0;
        
        for(let i = 2; i < amountY - 1; i += 2) {
            sumY += cordinatesY[i];
        }
        sumEvenY = 2 * sumY;
        integral = h / 3 * (cordinatesY[0] + cordinatesY[amountY - 1] + sumEvenY + sumOddY);
    
        return integral;
    }

    function IntegralSimpsonCount() {
        let fragm = 0;
        let hnArray = GetFragmentation(1, fragm);
        let h = hnArray[0];
        let n = hnArray[1];
        let cordinatesYn = SetXY(n, h);
        let integralSimpsonN = Integral(cordinatesYn, h);

        return integralSimpsonN;
    }

    function GetSeriesSum(x) {
        let yRes;
        curFunc = func;
        yRes = A0k/ 2;

        for(let i = 0; i < k; i++) {
            let part;
            ik = i + 1;
            part = AkArray[i] * Math.cos(ik * x) + BkArray[i] * Math.sin(ik * x);
            yRes += part;
        }

        return yRes;
    }

    function GetFourierFunction() {
        let tempA = c;
        AkArray = [];
        BkArray = [];

        cordinatesXF = [c];

        do {
            tempA += step;
            cordinatesXF.push(tempA);
        }while(tempA < d);

        A0k = 2 / T * IntegralSimpsonCount();
        for(let i = 0; i < k; i++) {
            ik = i + 1;
            curFunc = funcMcos;
            AkArray[i] = (2 / T * IntegralSimpsonCount());
            curFunc = funcMsin;
            BkArray[i] = (2 / T * IntegralSimpsonCount());
        }

        cordinatesYF = [];
        cordinatesXF.forEach(num => { 
            cordinatesYF.push(GetSeriesSum(num));
        });
    }
    
    function DrawGraph() {

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const data = new google.visualization.DataTable();

            let options = {
                curveType: 'function',
                title: `Функция вида ${funcName}`,
                legend: 'none',
                focusTarget: 'category',
                }; 
            let chart = new google.visualization.LineChart(document.querySelector('#curve_chart'));
            
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(cordinatesXF.length);

            for (let i = 0; i < cordinatesXF.length; i++) {
                data.setCell(i, 0, cordinatesXF[i]);
                data.setCell(i, 1, cordinatesYF[i]);
            }

            data.sort([{column:0}]);
            chart.draw(data, options);
        }
    }

    functionExamplesImgs.forEach(img => {
        img.addEventListener('click', () => {
            let imgAtr = img.getAttribute('data-func');

            functionExamplesImgs.forEach(img => {
                img.classList.remove('choosen-func');
            });

            img.classList.add('choosen-func');
            func = functionExamples[imgAtr].exp;
            T = functionExamples[imgAtr].valueT;
            funcName = functionExamples[imgAtr].name;
            a = -T;
            b = T;
        });
    });

    btnDecompose.addEventListener('click', () => {
        c = +beginSectionInput.value;
        d = +endSectionInput.value;
        k = +partNumberInput.value;

        GetFourierFunction();
        DrawGraph();
    });

    
});
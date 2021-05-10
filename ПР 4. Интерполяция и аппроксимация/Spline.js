'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const btnLagrange = document.querySelector('#Lagrange_btn');
    const btnSpline = document.querySelector('#Spline_btn');
    const blockLagrange = document.querySelector('.Lagrange_block');
    const blockSpline = document.querySelector('.Spline_block');
    const functionLists = document.querySelectorAll('.function_list li');
    const aInput = document.querySelector('[name="a-cordinate"]');
    const bInput = document.querySelector('[name="b-cordinate"]');
    const stepInput = document.querySelector('[name="step"]');
    const xInput = document.querySelector('[name="x-input"]');
    const funcInput = document.querySelector('.func_input');
    const btnGraph = document.querySelector('#Graph_btn');
    const resOutput = document.querySelector('.res_output');

    let curentFunc;
    let a;
    let b;
    let step;
    let X = [];
    let Y = [];
    let splines = [];

    function GetInputData() {
        X = [];
        Y = [];

        try {
            GetCurrentFunc(funcInput.textContent);
            a = +aInput.value;
            b = +bInput.value;
            step = +stepInput.value;

            if(funcInput.textContent === ''){
                throw new SyntaxError("Введите функцию");
            }
            if(aInput.value === ''){
                throw new SyntaxError("Введите начало отрезка");
            }
            if(bInput.value === ''){
                throw new SyntaxError("Введите конец отрезка");
            }
            if(stepInput.value === ''){
                throw new SyntaxError("Введите шаг");
            }
        } catch(e){
            alert(e.message);
            throw new Error();
        }
        
        MakeFragmentation(step, true);
        console.log(`Y: ${Y}`);
    }

    function GetCurrentFunc(funcText){
        switch(funcText){
            case '':
                alert('Введите функцию');
                break;
            case 'e^x':
                curentFunc = (x) => Math.E ** x;
                break;
            case 'e^(-x)':
                curentFunc = (x) => Math.E ** -x;
                break;
            case 'sh(x)':
                curentFunc = (x) => Math.sinh(x);
                break;
            case 'ch(x)':
                curentFunc = (x) => Math.cosh(x);
                break;
            case 'sin(x)':
                curentFunc = (x) => Math.sin(x);
                break;
            case 'cos(x)':
                curentFunc = (x) => Math.cos(x);
                break;
            case 'ln(x)':
                curentFunc = (x) => Math.log(x);
                break;
        }
    }

    function MakeFragmentation(stepFragm, hasFunction) {
        let num = a;
        X = [];
        do {
            X.push(num);
            if(hasFunction){
                Y.push(curentFunc(num));
            }
            num += stepFragm;
        }while(num <= b + stepFragm);
    }

    function BuildSpline(x, y) {
        let n = x.length;
        splines = [];

        for (let i = 0; i < n; i++){
            splines.push({a:null, b:null, c:null, d:null, x:null});
        }

        for (let i = 0; i<n; i++){
            splines[i].x = x[i];
            splines[i].a = y[i];
        }
        splines[0].c = splines[n-1].c = 0;

        let alpha = new Array(n - 1).fill(0);
        let beta  = new Array(n - 1).fill(0);

        for (let i = 1; i < n - 1; ++i) {

            let hi  = x[i] - x[i - 1];
            let hi1 = x[i + 1] - x[i];
            let A = hi;
            let C = 2.0 * (hi + hi1);
            let B = hi1;
            let F = 6.0 * ((y[i + 1] - y[i]) / hi1 - (y[i] - y[i - 1]) / hi);
            let z = (A * alpha[i - 1] + C);
            
            alpha[i] = -B / z;
            beta[i] = (F - A * beta[i - 1]) / z;
        }

        for (let i = n - 2; i > 0; --i) {
            splines[i].c = alpha[i] * splines[i + 1].c + beta[i];
        }

        for (let i = n - 1; i > 0; --i){
            let hi = x[i] - x[i - 1];
            splines[i].d = (splines[i].c - splines[i - 1].c) / hi;
            splines[i].b = hi * (2.0 * splines[i].c + splines[i - 1].c) / 6.0 + (y[i] - y[i - 1]) / hi;
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
            let chart = new google.visualization.LineChart(document.querySelector('.Spline_block #curve_chart'));
            
            MakeFragmentation(step / 4,  false);
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(X.length);

            
            for (let i = 0; i < X.length; i++) {
                data.setCell(i, 0, X[i]);
                data.setCell(i, 1, Interpolate(X[i]));
                console.log(data);
            }

            data.sort([{column:0}]);
            chart.draw(data, options);
        }
    }


    function Interpolate(x) {
        if (splines == null){
            return NaN;
        }

        const n = splines.length;
        let s = {a:null,b:null,c:null,d:null,x:null};

        if (x <= splines[0].x){
            s = splines[0];
        }else if (x >= splines[n - 1].x) {
            s = splines[n - 1];
        }else {
            let i = 0;
            let j = n - 1;

            while (i + 1 < j){
                let k = Math.round(i + (j - i) / 2);

                if (x <= splines[k].x){
                    j = k;
                }else {
                    i = k;
                }
            }
            s = splines[j];
        }

        let dx = x - s.x;  
        return s.a + (s.b + (s.c / 2.0 + s.d * dx / 6.0) * dx) * dx;
    }

    btnLagrange.addEventListener('click', () => {
        blockSpline.style.display = 'none';
        blockLagrange.style.display = 'flex';
    });

    btnSpline.addEventListener('click', () => {
        blockLagrange.style.display = 'none';
        blockSpline.style.display = 'flex';
    });

    btnGraph.addEventListener('click', () => {
        try {
            GetInputData();
        } catch(e) {
            return;
        }

        BuildSpline(X, Y);
        DrawGraph();

        if(xInput.value !== '') {
            let xToFind = xInput.value;
            resOutput.textContent = Interpolate(xToFind);
        } else {
            resOutput.textContent = '';
        }
        console.log(splines);
    });

    functionLists.forEach(func => {
        func.addEventListener('click', (e) => {
            funcInput.textContent = e.target.textContent;
        });
    });
});


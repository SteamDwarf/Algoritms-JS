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
    const funcInput = document.querySelector('.func_input');
    const btnGraph = document.querySelector('#Graph_btn');

    let curentFunc;
    let a;
    let b;
    let step;
    let X = [];
    let Y = [];
    let splines = [];

    /* const X = [0.1, 0.5, 0.9, 1.3, 1.7];
    const Y = [-2.3026, -0.69315, -0.10536, 0.26236, 0.53063];
    const x = 0.8; */
    //const X = [1, 1.04, 1.08, 1.12, 1.16, 1.2];
    //const Y = [2.7183, 2.8292, 2.9447, 3.0649, 3.1899, 3.3201];
    //const x = 1.05;


    function GetInputData() {
        X = [];
        Y = [];
        GetCurrentFunc(funcInput.textContent);
        a = +aInput.value;
        b = +bInput.value;
        step = +stepInput.value;
        MakeFragmentation();
        //console.log(`a: ${a}, b: ${b}, step: ${step}, X: ${X}, Y: ${Y}`);
    }

    function GetCurrentFunc(funcText){
        switch(funcText){
            case 'ex':
                curentFunc = (x) => Math.E ** x;
                break;
            case 'e-x':
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

    function MakeFragmentation() {
        do {
            X.push(a);
            Y.push(curentFunc(a));
            a += step;
        }while(a < b);
    }

    function BuildSpline(x, y) {
        let n = x.length;

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

    //BuildSpline(X,Y);
    //console.log(splines);
    //console.log(Interpolate(x));
    GetCurrentFunc('ex');
    MakeFragmentation();

    btnLagrange.addEventListener('click', () => {
        blockSpline.style.display = 'none';
        blockLagrange.style.display = 'flex';
    });

    btnSpline.addEventListener('click', () => {
        blockLagrange.style.display = 'none';
        blockSpline.style.display = 'flex';
    });

    btnGraph.addEventListener('click', () => {
        GetInputData();
        BuildSpline(X, Y);
        console.log(splines);
    });

    functionLists.forEach(func => {
        func.addEventListener('click', (e) => {
            funcInput.textContent = e.target.textContent;
        });
    });
});


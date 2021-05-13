'use strict';

document.addEventListener('DOMContentLoaded', () => {
    //const func = (x) => Math.sin(x);
    const func = (x) => x + 1;
    //const func = (x) => x**2;
    //const func = (x) => 2 / (x + 0.1);
    //const func = (x) => Math.E ** x;
    //const func = (x) => Math.asin(Math.sin(x));
    //const func = (x) => Math.sinh(Math.sin(x));
    const funcMcos = (x) => func(x) * Math.cos(x * ik);
    const funcMsin = (x) => func(x) * Math.sin(x * ik);

    let cordinatesX;
    let cordinatesY;
    let cordinatesXF;
    let cordinatesYF;
    let AkArray;
    let BkArray;
    //let T = Math.PI;
    let T = 2*Math.PI;
    let a = 0; 
    let b = T;
    let c = -10;
    let d = 10;
    let k = 100;
    let ik = 0;
    let step = 0.01;
    let curFunc = func;

    function GetFragmentation(k, fragm) {
        let h, n;

        if(fragm === 0) {
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
        let fragm = 500;
        //let fragm = 0;
        let hnArray = GetFragmentation(1, fragm);
        let h = hnArray[0];
        let n = hnArray[1];
        let cordinatesYn = SetXY(n, h);
        let integralSimpsonN = Integral(cordinatesYn, h);

        return integralSimpsonN;
    }

    function GetSeriesSum(x) {
/*         const A0k = () => 2 / T * IntegralSimpsonCount(func);
        const Ak = (x, m) => 2 / T * IntegralSimpsonCount(() => funcMcos(x, m));
        const Bk = (x, m) => 2 / T * IntegralSimpsonCount(() => funcMsin(x, m)); */

        let yRes;
        let A0k = 2 / T * IntegralSimpsonCount();
        curFunc = func;
        yRes = A0k/ 2;

        for(let i = 0; i < k; i++) {
            let part;
            ik = i + 1;
            /* let Ak;
            let Bk;

            ik = i;
            curFunc = funcMcos;
            Ak = 2 / T * IntegralSimpsonCount();
            curFunc = funcMsin;
            Bk = 2 / T * IntegralSimpsonCount(); */
            part = AkArray[i] * Math.cos(ik * x) + BkArray[i] * Math.sin(ik * x);
            yRes += part;
        }

        return yRes;
    }

    function GetResult() {
        let tempA = c;
        AkArray = [];
        BkArray = [];

        cordinatesXF = [c];

        do {
            tempA += step;
            cordinatesXF.push(tempA);
        }while(tempA < d);

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

    function GetFourierFunction() {
        GetResult();
        DrawGraph();
    }

    GetFourierFunction();
});
"use strict"

document.addEventListener("DOMContentLoaded", () => {
    let xCords = [2, 3, 4, 5, 6];
    let yCords = [0.4, 0.55, 0.13, 0.09, 0.07];
    let x = 10;
    /*let xCords = [2, 5, -6, 7, 4, 3, 8, 9, 1, -2];
    let yCords = [-1, 77, -297, 249, 33, 9, 389, 573, -3, -21];
    let x = 7;*/
    /*let xCords = [1.3, 2.1, 3.7, 4.5, 6.1, 7.7, 8.5];
    let yCords = [1.7777, 4.5634, 13.8436, 20.3952, 37.33872, 59.4051, 72.35931 ];
    let x = 1.5674;*/

    function GetFunctionY() {
        let result = 0;

        for(let i = 0; i < xCords.length; i++) {
            let polynom = GetPolynom(i);
            let superposition = yCords[i] * polynom;

            result += superposition;

            
        }

        console.log(result);
    }

    function GetPolynom(polIndex) {
        let polynom = 1;

        xCords.forEach((xj, j) => {
            if(j !== polIndex){
                let fraction = (x - xj) / (xCords[polIndex] - xj);
                polynom *= fraction;
            }
            
        });
        return polynom;
        console.log(polynom);
    }

   GetFunctionY();
});

//-4 * (-1.5) * (-0.6) * (-0.25)
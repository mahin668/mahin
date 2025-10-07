var numbers = [1,2,3,4,5];
//brokem mahin
function sum (n) {
        var summation = 0;

        //do the actual sum
        for (i=0; i<n.length;i++) {summation += n[i]}
        return summation;
}

console.log (sum (numbers) );

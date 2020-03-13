const slyGameApp = {
//This is a game that highlights the programming problem known as the "knapsack problem". The user is tasked with selecting items from a set such that the total weight does not exceed a certain weight while attempting to maximize the total value from their selection.

//variables

//itemsArray: this is an array used to store the items that have a WEIGHT, and a VALUE
itemsArray: [
        { weight: 2, value: 3},
        { weight: 5, value: 6 },
        { weight: 1, value: 2 },
        { weight: 4, value: 3 },
        { weight: 3, value: 4 }
],

//The carrying capacity of the character (can only carry 5 KG)
maxCapacity: 5,
currentCapacity: 0,
currentValue: 0,
answerArray: [],

//JQuery shorthands

//item is the specific item to be stolen
 $item: $('item'),
 $submit: $('submit')


};

//slyGameApp methods
slyGameApp.init = function () {
    slyGameApp.rng(1);
    slyGameApp.knapsackAlgorithm(slyGameApp.itemsArray);
}

//randomNumberGenerator, this generates a random number between two values given values with a starting default of 0
//I copied part of the code for selecting a random value from an inclusive set from this link: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
//The reason is so that if I want to generate a value for an array index I can do rng(length of array) and same time I can also if I want to make a random number between 3 and 7 (for weights/values of items, I can do that using this)
slyGameApp.rng = (min = 0,max) => {
    return min > 0 
                ? Math.floor((Math.random() * (max - min + 1)) + min)  //if true rng between selection
                : Math.floor(Math.random() * max); //if false number between 0 inclusive to num2 exclusive
}



//Test knapsack algorithm that receives an array of items to 
slyGameApp.knapsackAlgorithm = (itemArray) => {
    console.log(itemArray);
    itemArray.sort(slyGameApp.itemsCompareWeight); //sort array based on weight
    console.log(itemArray);

    //initialize memoization array X AXIS IS CARRYING CAPACITY, Y AXIS IS ITEM TO KEEP OR NOT 
    const rows = itemArray.length + 1;
    const cols = slyGameApp.maxCapacity + 1;
    const dpMatrix =  slyGameApp.createMatrix(rows, cols);
    let remainingCapacity = slyGameApp.maxCapacity;
    let currentValue = 0;
    let maxValue = 0;
    

    for (let i = 1; i < rows; i++){
        console.log("row: "+i);
        for (let j = 1; j < cols; j++){
            console.log("col "+j);
            console.log(itemArray[j-1]);
            if(itemArray[j-1].weight<remainingCapacity){
                dpMatrix[i][j] = itemArray[j-1].value;
            } else {
                dpMatrix[i][j] = dpMatrix[i-1][j];
            }
            
        }
    }

    // console.log("cols": dpMatrix[0].length);
    // console.log("rows": dpMatrix.length);
    
    console.log(dpMatrix);
}

//Utility function that helps sort an item array based on its weight
slyGameApp.itemsCompareWeight = (item1, item2) => {
        // Use toUpperCase() to ignore character casing

        const weight1 = item1.weight;
        const weight2 = item2.weight;
        let comparison = 0;

        if (weight1 > weight2) {
            comparison = 1;
        } else if (weight1 < weight2) {
            comparison = -1;
        }
        return comparison;
}

//This is a utility function that creates a N by M matrix and initializes it with all 0's in the first row & column
//DISCLAIMER I COPIED THIS CODE WITH SOME SMALL EDITS FROM THIS STACK OVERFLOW QUESTION
//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
//I had alot of trouble tring to figure out how to create a 2d matrix DYNAMICALLY using what we learned in class
slyGameApp.createMatrix = (rows, cols) => {
    let matrix = [];
    for (var i = 0; i < rows; i++) {
        matrix.push([]);
        matrix[i].push(new Array(cols));
        for (var j = 0; j < cols; j++) {
            matrix[i][0] = 0;
            matrix[0][j] = 0;
        }
    }
    return matrix;
}

//document ready
$(document).ready(function () {
    slyGameApp.init();
});
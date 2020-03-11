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
carryCapacity: 5,
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
slyGameApp.knapsackAlgorithm = (array) => {
    console.log(array);
    array.sort(slyGameApp.itemsCompareWeight); //sort array based on weight
    console.log(array);

    const dpMatrix = []
    for (let col =0; col<slyGameApp.carryCapacity; col++) {
        dpMatrix[col][0] = 0;
        for(let row =0; row<slyGameApp.array.length; row++) {
            dpMatrix[0][row] = 0;
        }
    }
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

//document ready
$(document).ready(function () {
    slyGameApp.init();
});
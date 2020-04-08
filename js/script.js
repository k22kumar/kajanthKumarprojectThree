const gemGameApp = {
  //This is a game that highlights the programming problem known as the "knapsack problem". The user is tasked with selecting gems from a set such that the total weight does not exceed a certain weight while attempting to maximize the total value from their selection.

  //variables

  //gemsArray: this is an array used to store the gems that have a WEIGHT, and a VALUE
  gemsArray: [],

  //The carrying capacity of the character (can only carry 5 KG)
  maxCapacity: 5,
  currentCapacity: 0,
  currentValue: 0,
  maxValue:0,
  difficulty:1,
  numberOfGems: 3,
  weightDifficulty: 2,
  valueDifficulty: 1,
  score: 0,

  //JQuery shorthands
};

//gemGameApp methods
gemGameApp.init = function () {

    gemGameApp.createGemsArray();
    gemGameApp.createGems();
    gemGameApp.knapsackAlgorithm(gemGameApp.gemsArray);
    gemGameApp.gemChoice();
    gemGameApp.checkAnswer();
}

//randomNumberGenerator, this generates a random number between two values given values with a starting default of 0
//NEED TO CHANGE OR LOOK UP DEFAULT VALUES
//I copied part of the code for selecting a random value from an inclusive set from this link: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
//The reason is so that if I want to generate a value for an array index I can do rng(length of array) and same time I can also if I want to make a random number between 3 and 7 (for weights/values of gems, I can do that using this)
gemGameApp.rng = (min=0,max) => {
    return min > 0 
                ? Math.floor((Math.random() * (max - min + 1)) + min)  //if true rng between selection
                : Math.floor(Math.random() * max); //if false number between 0 inclusive to num2 exclusive
}

//this function creates the gem array based on: number of gems, weight difficulty, value difficulty
gemGameApp.createGemsArray = () => {
    //empty the gems array
    gemGameApp.gemsArray = [];
    let weight=0;
    let value=0;
    //create a number of gems equal to the current gemNumber with rng weights and values
    for(i=0; i<gemGameApp.numberOfGems;i++) {
        weight = gemGameApp.rng(1, gemGameApp.weightDifficulty);
        value = gemGameApp.rng(1, gemGameApp.valueDifficulty)*10;
        const newGem = {weight: weight, value: value};
        gemGameApp.gemsArray.push(newGem);
    }
}

//this function will dynamically insert recipes into the html
gemGameApp.createGems = function () {
    $(".gemGallery").empty(); //clear out any gems already in gallery
    let i=0;
    // go through the gems array, and create each gem
    gemGameApp.gemsArray.forEach(function (gemObj) { 
        
        const htmlToAppend = `
        <button id="gem${i}" class="gemButton hide">
                        <div class="gem">
                            <i class="fas fa-gem"></i>
                        </div>
                        <ul class="gemInfo">
                            <li class="weight">
                                <p>${gemObj.weight}KG</p>
                            </li>
                            <li class="value">
                                <p>$${gemObj.value}</p>
                            </li>
                        </ul>
                    </button>`;
        $(".gemGallery").append(htmlToAppend);
        i++;
    })

    $('.gemButton').toggleClass('hide');
}


//Test knapsack algorithm that receives an array of gems to 
gemGameApp.knapsackAlgorithm = (gemArray) => {
    // console.log(gemArray);
    gemArray.sort(gemGameApp.gemsCompareWeight); //sort array based on weight
    // console.log(gemsArray);

    //initialize memoization array X AXIS IS CARRYING CAPACITY, Y AXIS IS ITEM TO KEEP OR NOT 
    const rows = gemArray.length + 1;
    const cols = gemGameApp.maxCapacity + 1;
    const dpMatrix =  gemGameApp.createMatrix(rows, cols);
    let withItemValue = 0;
    let withOutItemValue = 0;
    
    for (let i = 1; i < rows; i++){
        //loop through each row represeting the sorted gem
        
        for (let capacity = 1; capacity < cols; capacity++){
            //loop through each column representing the increasing bag size
            //if we CANNOT fit the gem, than max possible value is using previous gems ie one row before same column. 
            if(gemArray[i-1].weight > capacity ) {
                dpMatrix[i][capacity] = dpMatrix[i-1][capacity];
            } else {
                //check the values for if we take gem vs if we dont take gem
                withOutItemValue = dpMatrix[i-1][capacity];
                withItemValue = gemArray[i-1].value + dpMatrix[i-1][capacity-gemArray[i-1].weight];
                //assign the higher value to the matrix
                dpMatrix[i][capacity] = Math.max(withItemValue, withOutItemValue);
            }
            // END OF FOR LOOP
        }
    }   
    gemGameApp.maxValue = dpMatrix[rows-1][cols-1];
    console.log("max value is:" + gemGameApp.maxValue);
}

//debug function to print array to conosle 
gemGameApp.print2dArray = (matrix) => {
    const numOfRows = matrix.length;
    const numOfColumns = matrix[0].length;
    let row ="";
    for(i=0; i<numOfRows; i++){
        row = `row ${i}: `;
        for (j=0;j<numOfColumns; j++){
            row += matrix[i][j];
        }
        console.log(row);
    }
}

//Utility function that helps sort an gem array based on its weight
gemGameApp.gemsCompareWeight = (gem1, gem2) => {
        // Use toUpperCase() to ignore character casing

        const weight1 = gem1.weight;
        const weight2 = gem2.weight;
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
gemGameApp.createMatrix = (rows, cols) => {
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

//This function lets user know what gems are currently selected
gemGameApp.gemChoice = function() {
    $('.gemButton').on('click', function() {
        $(this).toggleClass('chosenGem');
    });
}

//This function will check the answer of users 
gemGameApp.checkAnswer = () => {
    $('.submit').on('click', function() {
        const $chosenGems = $('.gemButton.chosenGem');
        let totalWeight =0;
        let totalValue =0;
        $chosenGems.each(function () {
          console.log($(this).find('.weight p').text().slice(0,-2));
          //take the values in each gem p tag and add them up by parsing to int without any symbols
          totalWeight += parseInt($(this).find(".weight p").text().slice(0, -2));
          totalValue += parseInt($(this).find(".value p").text().slice(1));
        });
        totalValue === gemGameApp.maxValue
          ? gemGameApp.sucessHandler(totalValue)
          : gemGameApp.failureHandler();
        console.log("value " + totalValue + " weight " + totalWeight);
    })
}

//this function handles the sucess state of the game recieving the score to be added 
gemGameApp.sucessHandler = (newScore) => {
    $(".time").text(" correct ");
    gemGameApp.updateScore(newScore);
    gemGameApp.updateDifficulty();
    console.log(gemGameApp.difficulty);
    gemGameApp.updateCapacity();
    gemGameApp.resetButtons();
    gemGameApp.createGemsArray();
    gemGameApp.createGems();
    gemGameApp.knapsackAlgorithm(gemGameApp.gemsArray);
    gemGameApp.gemChoice();
}

//this function handles the fail state of the game
gemGameApp.failureHandler = () => {
    console.log("false");
    gemGameApp.resetButtons();
    $('.time').text(" failed ");
    alert('max value should have added up to: ' + gemGameApp.maxValue);
}

gemGameApp.resetButtons = () => {
  $(".gemButton").removeClass("chosenGem");
};

//function to update the score, if no param is given defaults to zero thus resetting the score
gemGameApp.updateScore = (scoreToAdd = 0) => {
    scoreToAdd === 0 ?
    gemGameApp.score = 0 :
    gemGameApp.score += scoreToAdd;
    const newScore = ` Score: $${gemGameApp.score} `;
    $('.score').text(newScore);
}

//function to update the capacity
gemGameApp.updateCapacity = () => {
    $('.capacity').text(` Max Capacity: ${gemGameApp.maxCapacity}KG` );
    console.log(gemGameApp.maxCapacity);
}

gemGameApp.updateDifficulty = () => {
    gemGameApp.difficulty++;
    $(".difficulty").text(` Level: ${gemGameApp.difficulty}` );
    if(gemGameApp.difficulty % 2 ==0) {
        gemGameApp.valueDifficulty++;
    }
    if (gemGameApp.difficulty % 3 == 0 && gemGameApp.difficulty <13) {
      gemGameApp.numberOfGems++;
    }
    if (gemGameApp.difficulty % 4 == 0) {
      gemGameApp.maxCapacity++;
    }
    if (gemGameApp.difficulty % 5 == 0) {
      gemGameApp.weightDifficulty++;
    }
}

//document ready
$(document).ready(function () {
    gemGameApp.init();
});
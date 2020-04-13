const gemGameApp = {
  //This is a game that highlights the programming problem known as the "knapsack problem". The user is tasked with selecting gems from a set such that the total weight does not exceed a certain weight while attempting to maximize the total value from their selection.

  //variables

  //gemsArray: this is an array used to store the gems that have a WEIGHT, and a VALUE
  gemsArray: [],

  //The carrying capacity of the character (can only carry 5 KG)
  maxCapacity: 3,
  maxValue: 0,
  difficulty: 1,
  numberOfGems: 3,
  weightDifficulty: 1,
  valueDifficulty: 1,
  colourDifficulty: 1,
  score: 0,
  //this represents the stash used for boosts in the game can only have 3 items init
  stash: [],
  potentialStash: [],

  //volume of Game
  volume: 0.15,

  //this is a global timer, by keeping it global, I can manipulate later on if I decide to add functionality
  timer: {
    totalSeconds: 60,
    start: function () {
      let timer = this;
      //create an interval as a property and count DOWN from 60
      this.interval = setInterval(function () {
        timer.totalSeconds -= 1;
        $(".time").text(parseInt(timer.totalSeconds));
      }, 1000);
    },

    pause: function () {
      clearInterval(this.interval);
      //remove the interval property
      delete this.interval;
    },

    resume: function () {
      //if the interval property has been deleted, create a new one ie restart
      if (!this.interval) this.start();
    },
  },
};

//gemGameApp methods
gemGameApp.init = function () {
  gemGameApp.resetGame();
  gemGameApp.checkAnswer();
  gemGameApp.boostHandler();
  gemGameApp.hambMenu();
  gemGameApp.restartGame();
  gemGameApp.instructionsButton();
  gemGameApp.playGameMenu();
  gemGameApp.startGame();
  gemGameApp.controlSound();
};

//this function is for the very first play button on the title screen to bring players to the game
gemGameApp.startGame = () => {
  $(".playGame").on("click", function () {
    $("header").addClass("hide");
    gemGameApp.showInstructions();
    $(".modal").removeClass("hide");
    $("main").removeClass("hide");
    gemGameApp.playSound('#music2');
  });
};

// $("#intro")[0].volume = gemAppGame.volume;

//function to control volume click
gemGameApp.controlSound = function () {
  $(".soundInput").on("click", function () {
    $(".volUp").toggleClass("hide");
    $(".volOff").toggleClass("hide");
    $(".volOff").hasClass("hide")
      ? (gemGameApp.volume = 0.15) //make 0.15
      : (gemGameApp.volume = 0);
    $('#music2')[0].volume = gemGameApp.volume;
  });
};

//function that handles playing sound
gemGameApp.playSound = (soundId) => {
    $(soundId)[0].volume = gemGameApp.volume;
    $(soundId)[0].play();
};

//randomNumberGenerator, this generates a random number between two values given values with a starting default of 0
//I copied part of the code for selecting a random value from an inclusive set from this link: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
//The reason is so that if I want to generate a value for an array index I can do rng(length of array) and same time I can also if I want to make a random number between 3 and 7 (for weights/values of gems, I can do that using this)
gemGameApp.rng = (min = 0, max) => {
  return min > 0
    ? Math.floor(Math.random() * (max - min + 1) + min) //if true rng between selection
    : Math.floor(Math.random() * max); //if false number between 0 inclusive to num2 exclusive
};

//this function creates the gem array based on: number of gems, weight difficulty, value difficulty
gemGameApp.createGemsArray = () => {
  //empty the gems array
  gemGameApp.gemsArray = [];
  let weight = 0;
  let value = 0;
  //create a number of gems equal to the current gemNumber with rng weights and values
  for (i = 0; i < gemGameApp.numberOfGems; i++) {
    weight = gemGameApp.rng(1, gemGameApp.weightDifficulty);
    value = gemGameApp.rng(1, gemGameApp.valueDifficulty) * 10;
    const newGem = { weight: weight, value: value };
    gemGameApp.gemsArray.push(newGem);
  }
};

//this function will dynamically insert recipes into the html
gemGameApp.createGems = function () {
  $(".gemGallery").empty(); //clear out any gems already in gallery
  let i = 0;
  // go through the gems array, and create each gem
  gemGameApp.gemsArray.forEach(function (gemObj) {
    const rngColour = gemGameApp.rng(1, gemGameApp.colourDifficulty);
    const htmlToAppend = `
        <button id="gem${i}" class="gemButton colour${rngColour} hide">
                        <div class="gem ">
                            <i class="fas fa-gem"></i>
                            <img class = "catSymbol hide" src="./assets/catWomanIcon.png" alt="cat woman icon depicting woman wearing cat mask ">
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
  });

  $(".gemButton").toggleClass("hide");
};

//Test knapsack algorithm that receives an array of gems to
gemGameApp.knapsackAlgorithm = (gemArray) => {
  gemArray.sort(gemGameApp.gemsCompareWeight); //sort array based on weight

  //initialize memoization array X AXIS IS CARRYING CAPACITY, Y AXIS IS ITEM TO KEEP OR NOT
  const rows = gemArray.length + 1;
  const cols = gemGameApp.maxCapacity + 1;
  const dpMatrix = gemGameApp.createMatrix(rows, cols);
  let withItemValue = 0;
  let withOutItemValue = 0;

  for (let i = 1; i < rows; i++) {
    //loop through each row represeting the sorted gem

    for (let capacity = 1; capacity < cols; capacity++) {
      //loop through each column representing the increasing bag size
      //if we CANNOT fit the gem, than max possible value is using previous gems ie one row before same column.
      if (gemArray[i - 1].weight > capacity) {
        dpMatrix[i][capacity] = dpMatrix[i - 1][capacity];
      } else {
        //check the values for if we take gem vs if we dont take gem
        withOutItemValue = dpMatrix[i - 1][capacity];
        withItemValue =
          gemArray[i - 1].value +
          dpMatrix[i - 1][capacity - gemArray[i - 1].weight];
        //assign the higher value to the matrix
        dpMatrix[i][capacity] = Math.max(withItemValue, withOutItemValue);
      }
      // END OF FOR LOOP
    }
  }
  gemGameApp.maxValue = dpMatrix[rows - 1][cols - 1];
  console.log("knapsack value is:" + gemGameApp.maxValue);
  gemGameApp.print2dArray(dpMatrix);
};

//debug function to print array to conosle
gemGameApp.print2dArray = (matrix) => {
  const numOfRows = matrix.length;
  const numOfColumns = matrix[0].length;
  let row = "";
  for (i = 0; i < numOfRows; i++) {
    row = `row ${i}: `;
    for (j = 0; j < numOfColumns; j++) {
      row += matrix[i][j];
    }
  }
};

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
};

//This is a utility function that creates a N by M matrix and initializes it with all 0's in the first row & column
//DISCLAIMER I COPIED THIS CODE WITH SOME SMALL EDITS FROM THIS STACK OVERFLOW QUESTION
//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
//I had alot of trouble tring to figure out how to create a 2d matrix DYNAMICALLY using what we learned in class
gemGameApp.createMatrix = (rows, cols) => {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix.push([]);
    matrix[i].push(new Array(cols));
    for (let j = 0; j < cols; j++) {
      matrix[i][0] = 0;
      matrix[0][j] = 0;
    }
  }
  return matrix;
};

//This function lets user know what gems are currently selected
gemGameApp.gemChoice = function () {
  $(".gemButton").on("click", function () {
    $(this).toggleClass("chosenGem");
    let colourBG = "";
    for(let i=1; i<5; i++){
        let colourClass = `colour${i}`;
        const classToAdd = `colour${i}chosen`;
        if( $(this).hasClass(colourClass)){
            $(this).toggleClass(classToAdd);
        }
    }

    //if it has a mask, remove mask and from the POTENTIAL stash
    if(!($(this).find('.catSymbol').hasClass('hide'))){
        $(this).find(".catSymbol").addClass('hide');
        $(this).find(".gem i").removeClass("hide");
        console.log("before removing from stash: ");
        console.log(gemGameApp.potentialStash);

        const index = gemGameApp.potentialStash.indexOf($(this).attr('id'));
        gemGameApp.potentialStash.splice(index,1);

        console.log("after removing from stash: ");
        console.log(gemGameApp.potentialStash);

        //if the stash is not empty assign a new mask
        if(!(gemGameApp.potentialStash.length === 0)) {
            //when a mask is removed goto the potential stash and add mask to the next item
            const nextStashedGem = `#${gemGameApp.potentialStash[0]}`;
            console.log($(nextStashedGem));
            $(nextStashedGem).find('.catSymbol').removeClass('hide');
            $(nextStashedGem).find(".gem i").addClass("hide");
            console.log('nextStashedGem: ' + nextStashedGem);
        }
    } else { //if it does not have a mask
        
        console.log('stashing');
        console.log(gemGameApp.potentialStash);
        //if nobody has a mask ie the potential stash is empty add a mask to it 
        if ((gemGameApp.potentialStash.length === 0)) {
          $(this).find(".catSymbol").removeClass("hide");
          $(this).find(".gem i").addClass("hide");
        }
        const gemToBeStashed = $(this).attr("id");
        //if the user selects a gem twice, it means they DONT want that gem so remove from potential stash
        if(gemGameApp.potentialStash.includes(gemToBeStashed)){
            const repeatIndex = gemGameApp.potentialStash.indexOf(gemToBeStashed);
            gemGameApp.potentialStash.splice(repeatIndex, 1);
        } else {
            //add to the potential stash
            gemGameApp.potentialStash.push(gemToBeStashed);
        }
        console.log(gemGameApp.potentialStash);
    }
  });
};


//This function will check the answer of users
gemGameApp.checkAnswer = () => {
  $(".submit").on("click", function () {
    const $chosenGems = $(".gemButton.chosenGem");
    let totalWeight = 0;
    let totalValue = 0;
    $chosenGems.each(function () {
      //take the values in each gem p tag and add them up by parsing to int without any symbols
      totalWeight += parseInt($(this).find(".weight p").text().slice(0, -2));
      totalValue += parseInt($(this).find(".value p").text().slice(1));
    });
    totalValue === gemGameApp.maxValue
      ? gemGameApp.sucessHandler(totalValue)
      : gemGameApp.failureHandler();
  });
};

//function to make sure boosts are used only once per round and give the appropiate boost
gemGameApp.boostHandler = () => {
  $('.boost').on('click', function() {
      let matches = 0;
      let currentComparison = "";
      let bonusScore = 0;
      let bonusSeconds =0;
    
        //only do expemsive compaison if more than one stashed gem
        if(gemGameApp.stash.length>1){
          gemGameApp.stash.sort();
        for (let i = 0; i < gemGameApp.stash.length - 1; i++) {

          //compare each item against one another looking for comparisons
          //if only one element than give them 20$

          currentComparison = gemGameApp.stash[i];
          for (let j = i; j < gemGameApp.stash.length - 1; j++) {
            if ((j+1 < gemGameApp.stash.length) && (currentComparison === gemGameApp.stash[j+1])) {
              matches++;
            }
          }
        }
        }
        
      

      gemGameApp.removeColourFromStash();

      //update score and time
      if (matches >= 1) {
        //im just adding to force it to make my equation work. Going to find a cleaner solution soon
      
      
      if (matches == 1) {
        matches++;
      }

      if (matches === 2) {
        bonusSeconds = 10;
      }
      
      if (matches === 3) {
        bonusSeconds = 30;
        bonusScore = (gemGameApp.stash.length - matches) * 20;
      }
        
      }

      if(matches ===0) {
        bonusScore = gemGameApp.stash.length* 20;
      }

      gemGameApp.updateScore(bonusScore);
      console.log("bonusScore: " + bonusScore);
      //give players 10 seconds for 2 matching gems and 30 for 3 matching gems
      
      

      console.log("matches: " + matches);
      console.log("bonusSeconds: " + bonusSeconds);
      gemGameApp.timer.totalSeconds += bonusSeconds;

      //user cant use boosts more than once per level
      $(".boost").addClass("disabled");
      //clear the stash
      gemGameApp.stash = [];
       gemGameApp.playSound("#boost");
  });
   

}

//function to remove styling from all stashes 
gemGameApp.removeColourFromStash = () => {
  let colourClass = "";
  let stash = "";
  for (stashIndex = 1; stashIndex < 4; stashIndex++) {
    stash = `#stash${stashIndex}`;
    for (let i = 1; i < 5; i++) {
      colourClass = `colour${i}`;
      $(stash).removeClass(colourClass);
    }
  }
}
      

//this function handles the sucess state of the game recieving the score to be added
gemGameApp.sucessHandler = (newScore) => {
  gemGameApp.playSound("#jewels");

    //boost stash gem colour handler
    if(gemGameApp.stash.length<3){
        const gemToStash = `#${gemGameApp.potentialStash[0]}`;
        //go thru the four possible colours, give the stashed gem the same colour class
        for (let i = 1; i < 5; i++) {
          let colourClass = `colour${i}`;
          const newStashedGem = `#stash${gemGameApp.stash.length + 1}`;
          console.log(newStashedGem);
          if ($(gemToStash).hasClass(colourClass)) {
            $(newStashedGem).addClass(colourClass);
            //save the colour to compare later during boostHandling
            gemGameApp.stash.push(colourClass);
          } else {
            $(newStashedGem).removeClass(colourClass);
          }
        }
    }
  gemGameApp.potentialStash = [];
  $(".boost").removeClass("disabled");
  
  gemGameApp.updateScore(newScore);
  gemGameApp.updateDifficulty();
  gemGameApp.updateCapacity();
  gemGameApp.resetButtons();
  gemGameApp.createGemsArray()
  gemGameApp.createGemsArray();
  gemGameApp.createGems();
  gemGameApp.knapsackAlgorithm(gemGameApp.gemsArray);
  gemGameApp.gemChoice();
};


//this function handles the fail state of the game
gemGameApp.failureHandler = () => {
  gemGameApp.timer.pause();
  gemGameApp.resetButtons();
  $(".modalTitle").text("Game Over!");
  $(".finalScore").text(
    `Final Score: Level ${gemGameApp.difficulty} with ${gemGameApp.score}$`
  );
  $(".finalScore").removeClass("hide");
  $("#playGameMenu").addClass("hide");
  $("#instructions").removeClass("hide");
  gemGameApp.openModal();
};

gemGameApp.resetButtons = () => {
  $(".gemButton").removeClass("chosenGem");
};

//function to update the score, if no param is given defaults to zero thus resetting the score
gemGameApp.updateScore = (scoreToAdd) => {
  gemGameApp.score += scoreToAdd;
  const newScore = ` Score: $${gemGameApp.score} `;
  $(".score").text(newScore);
};

//function to update the capacity
gemGameApp.updateCapacity = () => {
  $(".capacity").text(` Bag: ${gemGameApp.maxCapacity}KG`);
};

//function to increase difficulty steadily upon sucessful rounds
gemGameApp.updateDifficulty = () => {
  gemGameApp.difficulty++;
  $(".difficulty").text(` Level: ${gemGameApp.difficulty}`);
  if (gemGameApp.difficulty % 1 == 0) {
    gemGameApp.valueDifficulty++;
  }
  if (gemGameApp.difficulty % 2 == 0 && gemGameApp.difficulty < 13) {
    gemGameApp.numberOfGems++;
  }
  if (gemGameApp.difficulty % 3 == 0) {
    gemGameApp.maxCapacity++;
  }
  if (gemGameApp.difficulty % 3 == 0) {
    gemGameApp.weightDifficulty++;
  }
  if (gemGameApp.difficulty % 5 == 0 ) {
    if(gemGameApp.colourDifficulty<5)
    gemGameApp.colourDifficulty++;
    }
  
};

//this function periodicly checks the  "global" timer and when it reaches 0 ends the game
gemGameApp.checkTimer = () => {
  let endTimer = setInterval(() => {
    if (gemGameApp.timer.totalSeconds <= 0) {
      clearInterval(endTimer);
      gemGameApp.failureHandler();
    }
  }, 400);
};


//function to CLOSE the modal
gemGameApp.closeModal = () => {
  $(".modal").addClass("hide");
};

//function to SHOW the modal WHEN HAMBMENU IS CLICKED
gemGameApp.hambMenu = () => {
  $(".hambMenu").on("click", function () {
    $("#instructions").removeClass("hide");
    $("#playGameMenu").addClass("hide");
    gemGameApp.openModal();
    gemGameApp.timer.pause();
  });
};

//function to SHOW the modal
gemGameApp.openModal = () => {
  $(".modal").removeClass("hide");
};

gemGameApp.restartGame = () => {
  $("#restart").on("click", function () {
    gemGameApp.closeModal();
    gemGameApp.resetGame();
    gemGameApp.timer.start();
  });
};

//this function will reset the game from scratch
gemGameApp.resetGame = () => {
  //boost doesnt have an gems to boost on start of game
  $('.boost').addClass('disabled');
  gemGameApp.gemsArray = [];
  gemGameApp.stash = [];
  gemGameApp.potentialStash = [];
  gemGameApp.removeColourFromStash();
  gemGameApp.maxCapacity = 2;
  gemGameApp.maxValue = 0;
  gemGameApp.difficulty = 1;
  $(".difficulty").text(` Level: ${gemGameApp.difficulty}`);
  gemGameApp.numberOfGems = 1;
  gemGameApp.weightDifficulty = 1;
  gemGameApp.valueDifficulty = 1;
  gemGameApp.colourDifficulty = 1;
  gemGameApp.score = 0;
  gemGameApp.updateScore(0);
  gemGameApp.createGemsArray();
  gemGameApp.createGems();
  gemGameApp.timer.pause();
  $(".time").text(parseInt(60));
  gemGameApp.timer.totalSeconds = 60;

  
  gemGameApp.checkTimer();
  gemGameApp.knapsackAlgorithm(gemGameApp.gemsArray);
  gemGameApp.updateCapacity();
  gemGameApp.gemChoice();
  // gemGameApp.checkAnswer();
  $(".finalScore").addClass("hide");
  $(".modalTitle").text("Gem Heist!");
};

//function that handles when player CLICKS on instructions
gemGameApp.instructionsButton = () => {
  $("#instructions").on("click", function () {
    gemGameApp.showInstructions();
  });
};

//this function will show the instructions to player
gemGameApp.showInstructions = () => {
  $(".instructionsText").removeClass("hide");
  $("#restart").addClass("hide");
  $("#instructions").addClass("hide");
  $(".finalScore").addClass("hide");
  $("#playGameMenu").removeClass("hide");
};

//function to play game IF started from the instructions menu
gemGameApp.playGameMenu = () => {
  $("#playGameMenu").on("click", function () {
    gemGameApp.closeModal();
    $(".instructionsText").addClass("hide");
    $(".finalScore").addClass("hide");
    $("#restart").removeClass("hide");
    gemGameApp.resetGame();
    gemGameApp.timer.start();
  });
};

//

//document ready
$(document).ready(function () {
  gemGameApp.init();
});

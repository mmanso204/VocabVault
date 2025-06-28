function adjustButtonMargins() {
  /*
  This function changes the size of the dropdown buttons and the search bar.
  It also govens the text dispaying variables in the down right corner.

  This function has no parameters and returns nothing
  */
  const buttons = document.querySelectorAll('.dropdown .dropbtn'); //selects all dropdown buttons
  const dropdown = document.querySelectorAll('.dropdown-content a:hover'); //should select all buttons in the dropdown menus
  const width = window.innerWidth; //grabs the width of the browser window
  const height = window.innerHeight; //grabs the height of the browser window
  const searchBar = document.querySelector('.navbar input[type= text]'); //selects the searchbar
  
  let marginValue;
  let marginValueNumber;

  let searchBarWidth
  let searchBarWidthNumber
  
  // adjusts the margin value based on the width of the browser window
  marginValueNumber = width/10-45;

  // changes the margin value to 0 when it becomes less than 0
  if (marginValueNumber < 0) {
      marginValueNumber = 0
  }

  // changes the margin value to a string and adds 'px'
  marginValue = marginValueNumber + 'px'

  // changes the margin value for each dropdown button
  buttons.forEach(button => {
      button.style.paddingRight = marginValue;
      button.style.paddingLeft = marginValue;
  });
  
  // doesn't work, but the idea was that it changes the size of the buttons in the dropdown menu to match the dropdown buttons
  dropdown.forEach(button => {
      button.style.paddingRight = marginValue;
      button.style.paddingLeft = marginValue;
  });

  // adjusts the search bar width based on the width of the browser window
  searchBarWidthNumber = width/3    ;

  // changes the search bar width to 66 when it becomes less than 66
  if (searchBarWidthNumber < 66) {
      searchBarWidthNumber = 66
  }

  // changes the search bar width to a string and adds 'px'
  searchBarWidth = searchBarWidthNumber + 'px'

  // changes the search bar width
  searchBar.style.width = searchBarWidth;


  // displays the width, height and margin values
  // document.getElementById('windowSize').innerText = `Width: ${width}px, Height: ${height}px, MarginValue: ${marginValue}, SearcBarWidth: ${searchBarWidthNumber}, scrollY: ${window.scrollY}`;
}

function makeNavBarSticky() {
  /*
  This function makes the navbar sticky when the user scrolls down, it also makes it not sticky anymore when the user scrolls back up
  
  This function has no parameters and returns nothing
  */
  var navbar = document.getElementById("navbar"); // this selects the navbar

  var sticky = navbar.offsetTop; //this is a variable that hold the distance between the top of the page and the top of the navbar

  // this makes the navbar sticky when the navbar reaches the top of the screen
  if (window.scrollY >= sticky) {
      navbar.classList.add("sticky")
  
  }
  
  //this makes the navbar not sticky anymore when the user has scrolled back up
  if (window.scrollY < 8) {
      navbar.classList.remove("sticky");
  }
}

function combinedScrollFunctions() {
  /*
  This function combines the makeNavBarSticky, adjustButtonMArgins, and calendarFunction functions so they can both be activated when scrolling
  (the adjustButtonMargins fuction needs to be activated to adjust show the current distance scrolled by the user)

  This function has no parameters and returns nothing
  */
  makeNavBarSticky();
  adjustButtonMargins();
  calendarFunction();
}

function initializeCalendar() {
  /*  
  This function creates and initializes a callendar using the Fullcallendar javascript library.

  This function has no parameters and returns the created library.
  */

  // Get the html element that the calendar will be rendered
  var calendarEl = document.getElementById('calendar');
  
  // Create a new instance of FullCalendar.Calendar 
  var calendar = new FullCalendar.Calendar(calendarEl, {
      // Pass some options
      initialView: 'dayGridMonth',
      headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'today'
      },
      handleWindowResize: true,
      contentHeight: 400,
      events: [],
      
      // This function opens the event's URL in a new window and prevents the default action for the click event.
      eventClick: function(info) {    
          window.open(info.event.url);
          info.jsEvent.preventDefault();
      }
  });
  return calendar;
}

function calendarFunction() {
  /*
  makes a calendar with words and links to their corresponding pages appear when the calendar button is clicked

  this function has no parameters and returns nothing
  */
  // Get the modal
  var modal = document.getElementById("calendarModal");
  // Get the button that opens the modal
  var btn = document.querySelector(".floatingButtonCalendar");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
  // Initialize the calendar object 
  var calendar = initializeCalendar();

  // Event listener on the button to open the modal
  btn.onclick = function() {
      modal.style.display = "block"; // Make it visible
      
      // Render the calendar
      calendar.render();

      // AJAX request with GET method to update the events of the calendar
      $.ajax({
          url: '/get_words/',
          type: 'GET',
          success: function(response) {
              console.log('Response:', response);
              
              calendar.removeAllEvents(); // Remove old events
              calendar.addEventSource(response); // Add new events
          }
      });
  }

  // Event listener on the <span> (x) button to close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // Event listener on anywhere outside of the modal to close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

/**
 * Refreshes the page to reset the Wordle puzzle. This function has no parameters and returns nothing.
 */
function refresh() {
  /* 
    This function refreshes the page to reset the wordle puzzle

    This function jas no parameters and returns nothing
  */
    location.reload(true);

}

/**
 * Dynamically generates a Wordle game board as an HTML table based on the current answer. It creates a 6xN grid
 * where N is the length of the answer. Each cell contains an input for a letter with placeholders and labels indicating
 * the word and letter position. At the bottom, a "New puzzle" button is added to allow refreshing the game.
 */
function drawTable()  {
  /*
  This function creates the table used to play the wordle game.

  This function has no parameters and returns nothing.
  */
  
  //get the answer of the puzzle
  let answer = currentAnswer

  
  let html = '<div id="wordleContainer"><table>';
  let rows = 6
  let letterCount = answer.length;
  let cols = letterCount

  let counter = 0
  let wordCounter = 0

  //create 6 rows
  for(let i = 0; i < rows; i++) {
    html += '<tr>';
    let letterCounter = -1
    //create an label and input element for for each letter in the answer
    for(let j = 0; j < cols; j++) {
      counter += 1
      letterCounter += 1
      let correctLetter = answer.charAt(letterCounter)
      
      html += '<td><label for="input' + counter + '">Word ' + (wordCounter+1) + ' Letter ' + (letterCounter+1) + ':</label><input onkeyup="moveForward(this, event)" class="Incorrect" type="text" id="input' + counter + '" name="input' + counter + '" maxlength="1" pattern="' + answer + '" data-correct-pattern="' + correctLetter + '" placeholder=" "></td>';
    }

    html += '</tr>';
    wordCounter +=1
  }

  //has some extra wite lines to enable scrolling for a better viewing experience
  html += '</table></div><button onclick="refresh()" id="retrybutton">New puzzle</button><br><br><br><br><br><br><br><br>';

  //adds the html code to the page
  document.body.innerHTML += html;
}   

let correctWord
/**
 * Checks the user's input against the correct answer. For each input, it updates the class to reflect whether the
 * letter is correct, in the wrong place, or incorrect. It also handles win/lose conditions by displaying appropriate
 * messages and revealing the retry button.
 */
function CheckInput() {
  /*
  This function checks input elements for the correct letters
  It also marks input elements with the corresponding classes and checks to see if the user has won or lost.

  This function has no parameters and returns nothing.
  */
  //gets the dic element that contains the wordle game
  wordleDiv = document.querySelector('#wordleContainer')
  //stops the function from doing something when it shouldn't, mainly to prevent it from constantly adding the winmessage or losemessage to the page.
  if (!usagesLeft == 0) {
  
    //gets all input elements
    let inputs = document.querySelectorAll('input');

    //gets all rows of the table
    let rows = document.querySelectorAll('table tr');

    //marks each input element
    inputs.forEach(function(input) {
      
      const userAnswer = input.value;
      correctWord = input.getAttribute("pattern");
      const correctLetter = input.getAttribute("data-correct-pattern");
  
      let style = window.getComputedStyle(input);
      let pointerEvents = style.getPropertyValue('pointer-events');
      
      
      if (pointerEvents == 'none'){
        
        //adds the correct class if the letter is in the correct place, adds the WrongPlace class if the letter is in the wrong place and the incorrect class if the letter is not in the word.
        if (userAnswer == correctLetter.toUpperCase() || userAnswer == correctLetter.toLowerCase()) {
          input.classList.remove("Incorrect")
          input.classList.remove("WrongPlace")
          input.classList.add("Correct")
        } else if ((correctWord.includes(userAnswer.toLowerCase()) || correctWord.includes(userAnswer.toUpperCase())) && !(userAnswer == correctLetter.toUpperCase() || userAnswer == correctLetter.toLowerCase()) && !(userAnswer == '')) {
          input.classList.remove("Incorrect")
          input.classList.remove("Correct")
          input.classList.add("WrongPlace")
        } else {
          input.classList.remove("WrongPlace")
          input.classList.remove("Correct")
          input.classList.add('Incorrect')
        }
        
      }});
    
    answeredInputs = 0
    //does the following for each row
    rows.forEach(function(row) {
      if (!isWinner == true) {
        // Get all the input elements in this row
        let inputs = row.querySelectorAll('input');

        let correctInputs = 0
        
        //does the following for each input
        inputs.forEach(function(input) {
          
          if (input.classList.contains('Correct')) {
            correctInputs += 1
          }
          
          if (!input.value == '') {
            answeredInputs += 1
          }
          });

          //checks to see if user has won
          if (correctInputs == currentAnswer.length) {
          isWinner = true
          
          //this is to make sure that it doesn't add the winmessage to the page repeatedly
          if (usagesLeft > 1) {
            
            //adds a you win message to the page when the user has won, also makes the 'new puzzle' button appear
            let winMessage = document.createElement('div');
            winMessage.textContent = 'You win';
            winMessage.style.fontSize = '2em'; // Set the font size or any other styles as needed
            let table = document.querySelector('table'); // Replace with your actual table selector
            wordleDiv.appendChild(winMessage);
            usagesLeft = 1
            retrybutton = document.querySelector('#retrybutton')
            retrybutton.style.display = 'unset'
            
            } 
          }
          
          //checks to see if user has lost
          if (answeredInputs == currentAnswer.length*6 && isWinner == false) {
            
            
            //his is to make sure that it doesn't add the losemessage to the page repeatedly
            if (usagesLeft > 1) {
              
              //adds a you lose message to the page when the user has lost, also makes the 'new puzzle' button appear
              let loseMessage = document.createElement('div');
              loseMessage.textContent = 'You lose, the correct word is was ';
              loseMessage.textContent += correctWord
              loseMessage.style.fontSize = '2em'; // Set the font size or any other styles as needed
              let table = document.querySelector('table'); // Replace with your actual table selector
              wordleDiv.appendChild(loseMessage);
              usagesLeft = 1
              retrybutton = document.querySelector('#retrybutton')
              retrybutton.style.display = 'unset'
              
              } 
            }

            if (answeredInputs == currentAnswer.length*6 && isWinner == false) {
              
              // Create a new element, set its text to 'You win', and insert it before the first row
              
              if (usagesLeft > 1) {
                
                let loseMessage = document.createElement('div');
                loseMessage.textContent = 'You lose, the correct word is ';
                loseMessage.textContent += correctWord
                loseMessage.style.fontSize = '2em'; // Set the font size or any other styles as needed
                let table = document.querySelector('table'); // Replace with your actual table selector
                wordleDiv.appendChild(loseMessage);
                usagesLeft = 1
                retrybutton = document.querySelector('#retrybutton')
                retrybutton.style.display = 'unset'
                
                } 
              }

        } else {
          //hides all unused rows
          row.style.display = 'none';
          
        }

        if (usagesLeft == 1) {usagesLeft = 0}
    });
    
  }
}

/**
 * Combines multiple functions to be called on page load. Specifically, it initializes the Wordle game board,
 * adjusts button margins, and activates any additional functions like a calendar widget.
 */
function combinedOnloadFunctions() {
  /*
  This function combines the drawTable, adjustButtonMArgins, and calendarFunction functions so they can both be called when the page loads
  

  This function has no parameters and returns nothing
  */
  drawTable();
  adjustButtonMargins();
  calendarFunction();
}

let isWinner = false
let usagesLeft = 2

let currentAnswer = ''

//grabs all the favorites from the html page
var allFavorites = document.querySelectorAll('div.FavoriteEntry');
//shows a message if the user has no favorite words, otherwise selects a random word from their favorites to be used for the wordle puzzle
if (allFavorites.length == 0) {
  html = "<h4>looks like you have no favorite words, you can add words to your favorites by clicking the 'add to favorites' button</h4>"
  document.body.innerHTML += html;

} else {
  var randomIndex = Math.floor(Math.random() * allFavorites.length);
  var randomFavoriteDiv = allFavorites[randomIndex];
  currentAnswer = randomFavoriteDiv.querySelector('p').textContent
}


window.onresize = adjustButtonMargins; //activates the adjustButtonMargins function when resizing the browser window
window.onload = combinedOnloadFunctions; //activates the adjustButtonMargins function when the browser loads
window.onscroll = combinedScrollFunctions; //activates the combinedScrollFunctions function when scrolling


// makes the cursor jump to the next input window when a button (presumabally a letter) is pressed
document.addEventListener('keyup', function(event) {
  var input = event.target;
  if (input.tagName === "INPUT") {
      if (input.value.length >= input.maxLength) {
          var nextTd = input.parentElement.nextElementSibling;
          if (nextTd) {
              var nextInput = nextTd.querySelector('input');
              if (nextInput) {
                  nextInput.focus();
              }
          }
      }
  }
});

// makes the backspace button remove the value in the previous input window when pressed and makes it function normally when the current input element already has a value
document.addEventListener('keydown', function(event) {
  var input = event.target;
  if (input.tagName === "INPUT" && event.key === "Backspace") {
      var previousTd = input.parentElement.previousElementSibling;
      if (previousTd) {
          var previousInput = previousTd.querySelector('input');
          if (previousInput) {
              if (!input.value == '') {
                  input.value = '';
              } else {
                previousInput.value = '';
                previousInput.focus();
              }
          }
      }
  }
});

//makes the enter button move the cursor to the next row and check the word for correct letters
document.addEventListener('keydown', function(event) {
  var input = event.target;
  if (input.tagName === "INPUT" && event.key === "Enter") {
      event.preventDefault(); // prevent form submission
      var currentTd = input.parentElement;
      var nextTr = currentTd.parentElement.nextElementSibling;
      var currentTr = currentTd.parentElement;
      var lastTd = currentTr.querySelector('td:last-of-type');
      if (currentTd == lastTd && !input.value == '') {
        continueWhile = true;
        inputElement = currentTd.querySelector('input');
        currentTr.style.pointerEvents = 'none'
        CheckInput()
        if (nextTr) {
          var nextInput = nextTr.querySelector('input');
          if (nextInput) {
              nextInput.focus();
          }
        }
      } 
      
    }
});

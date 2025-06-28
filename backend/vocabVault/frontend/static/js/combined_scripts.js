document.addEventListener('DOMContentLoaded', function() {
    calendarFunction();
    adjustButtonMargins();

})

window.addEventListener('scroll', makeNavBarSticky);

function adjustButtonMargins() {
    /*
    This function changes the size of the dropdown buttons and the search bar.
    It also govens the text dispaying variables in the down right corner.

    This function has no parameters and returns nothing
    */
    const buttons = document.querySelectorAll('.dropdown .dropbtn'); //selects all dropdown buttons
    // const dropdown = document.querySelectorAll('.dropdown-content a:hover'); //should select all buttons in the dropdown menus
    const width = window.innerWidth; //grabs the width of the browser window
    const searchBar = document.querySelector('.navbar input[type= text]'); //selects the searchbar
    
    let marginValue = Math.max(width / 10 - 45, 0) + 'px';
    let searchBarWidth = Math.max(width / 3, 66) + 'px';

    // changes the margin value for each dropdown button
    buttons.forEach(button => {
        button.style.paddingRight = marginValue;
        button.style.paddingLeft = marginValue;
    });

    // changes the search bar width
    searchBar.style.width = searchBarWidth;
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
        navbar.classList.add("sticky");
    } else if (window.scrollY < 8) {
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
    calendarFunction();
}

function initializeCalendar() {
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

// Function to fetch and update calendar events
function updateCalendarEvents() {
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

function calendarFunction() {
    // Get the modal
    var modal = document.getElementById("calendarModal");
    // Get the button that opens the modal
    var btn = document.querySelector(".floatingButtonCalendar");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Initialize the calendar object 
    var calendar = initializeCalendar();

    // When the user clicks the button, open the modal
    btn.addEventListener('click', function() {
        modal.style.display = "block";
        
        // Render the calendar
        calendar.render();
        updateCalendarEvents(); // Fetch and update events when modal opens
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function initializeFormElements(){
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');

    if (usernameInput && emailInput && submitBtn) {
        submitBtn.addEventListener('click', function(event) {
            handleFormSubmission(event, usernameInput, emailInput);
        });
    }
}

// Account page scripts
function displayProfilePic() {
    const input = document.getElementById('photo');
    const img = document.getElementById('profilePic');
    
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        img.src = e.target.result;
        img.style.display = 'block';
      };

      reader.readAsDataURL(input.files[0]);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Select the buttons by their IDs
    const changeButton = document.getElementById('changeButton');
    const saveButton = document.getElementById('saveButton');

    // Check if the buttons exist to avoid errors
    if (changeButton) {
        changeButton.addEventListener('click', toggleEdit);
    }

    if (saveButton) {
        saveButton.addEventListener('click', saveChanges);
    }
});

let editMode = false; // Initial state: Display mode

function toggleEdit() {
    // Toggle the edit mode state
    editMode = !editMode;

    // Get elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const usernameInput = document.getElementById('usernameInput');
    const emailDisplay = document.getElementById('emailDisplay');
    const emailInput = document.getElementById('emailInput');
    const profilePic = document.getElementById('profilePic');
    const profilePicInput = document.getElementById('profilePicInput');
    // Select the buttons by their IDs
    const changeButton = document.getElementById('changeButton');
    const saveButton = document.getElementById('saveButton');

    // Toggle visibility based on edit mode
    if (editMode) {
        usernameDisplay.style.display = 'none';
        emailDisplay.style.display = 'none';
        if (profilePic) profilePic.style.display = 'none'; // Check if profilePic exists
        usernameInput.style.display = 'block';
        emailInput.style.display = 'block';
        if (profilePicInput) profilePicInput.style.display = 'block'; // Check if profilePicInput exists
        changeButton.textContent = 'Cancel'; // Change button text to "Cancel"
        changeButton.style.backgroundColor = 'red'; // Change background color to red

        
    } else {
        usernameDisplay.style.display = 'block';
        emailDisplay.style.display = 'block';
        if (profilePic) profilePic.style.display = 'block'; // Check if profilePic exists
        usernameInput.style.display = 'none';
        emailInput.style.display = 'none';
        if (profilePicInput) profilePicInput.style.display = 'none'; // Check if profilePicInput exists
        changeButton.textContent = 'Change'; // Change button text back to "Change"
        changeButton.style.backgroundColor = ''; // Reset background color

        
    }
}
  
function saveChanges() {
    const newUsername = document.getElementById('usernameInput').value;
    const newEmail = document.getElementById('emailInput').value;
    let newProfilePic = null;
    const profilePicInput = document.getElementById('profilePicInput');
    if (profilePicInput && profilePicInput.files && profilePicInput.files.length > 0) {
        newProfilePic = profilePicInput.files[0];
    }

    const data = new FormData();
    if (newUsername) {
        data.append('username', newUsername);
    }
    if(newEmail) {
        data.append('email', newEmail);
    }
    if (newProfilePic) {
        data.append('profile_pic', newProfilePic);
    }

    fetch('/update_user_info', { // Adjust the URL based on your routing setup
        method: 'POST',
        body: data,
        credentials: 'include', // Include cookies in the request
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), // Ensure you are getting the CSRF token correctly
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            console.log('User info updated successfully');
            toggleEdit();
            window.location.reload();
        } else {
            console.error('Error updating user info:', data.error);
            const errorMessage = document.getElementById('errorMessage');
            if (!errorMessage) {
                console.error('Error message element not found');
                return;
            }
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.getElementById('errorMessage');
        if(errorMessage) {
            errorMessage.textContent = 'Network error or server is unreachable';
            errorMessage.style.display = 'block';
        }
    });
}

// EditWordPage scripts
let wordName = '';
let wordDescription = '';

function changeColor(button) {
    const container = button.parentNode;
    const textContainer = container.querySelector('.TextContainer');
    
    if (wordName != container.querySelector('a').textContent && container.querySelector('a').textContent != 'Deleted from favorites')  {
        wordName = container.querySelector('a').textContent
    }

    if (wordDescription != textContainer.textContent && textContainer.textContent != '')  {
        wordDescription = textContainer.textContent
    }

    // Check if the container already has the 'red' class
    if (container.classList.contains('red')) {
        // If it has the class, remove it to revert the color
        container.classList.remove('red');
        button.textContent = 'Deleted from favorites';
        container.querySelector('a').textContent = wordName;
        textContainer.textContent = wordDescription;
        
    } else {
        // If it doesn't have the class, add the 'red' class to change the color
        container.classList.add('red');
        button.textContent = 'Undo delete';
        container.querySelector('a').textContent = 'Deleted from favorites';
        textContainer.textContent = "";
    }  
}

// Flashcard scripts
// Initialize the current flashcard index and total number of flashcards
let currentFlashcard = 1;
const totalFlashcards = document.querySelectorAll('.flashcard').length;
const flashcards = document.querySelectorAll('.flashcard');

// Show the first flashcard on page load
document.addEventListener("DOMContentLoaded", function() {
    if (flashcards.length > 0) {
        flashcards[0].style.display = 'block';
    }
});

function nextFlashcard() {
    flashcards[currentFlashcard - 1].style.display = 'none';
    currentFlashcard = (currentFlashcard % totalFlashcards) + 1;
    flashcards[currentFlashcard - 1].style.display = 'block';
}

function previousFlashcard() {
    flashcards[currentFlashcard - 1].style.display = 'none';
    if (currentFlashcard === 1) {
        currentFlashcard = totalFlashcards;
    } else {
        currentFlashcard -= 1;
    }
    flashcards[currentFlashcard - 1].style.display = 'block';
}

// Register scripts
// Function to get cookie by name; used to get the CSRF token
/**
 * Retrieves the value of a specified cookie by its name.
 * 
 * @param {string} name The name of the cookie to retrieve.
 * @returns {string|null} The value of the cookie if found, otherwise `null`.
 */
function getCookie(name) {
    let cookieValue = null;
    
    // Check for cookies 
    if (document.cookie && document.cookie !== '') {
        // Split into an array of individual cookie strings in the format ("name=value; name2=value2")
        const cookies = document.cookie.split(';');

        // Iterate over the array to find the cookie
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Checks if the current cookie string starts with "name"
            if (cookie.substring(0, name.length + 1) === (name + '=')) {                
                // Decode the value to correctly interpret any encoded characters
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Handles the frontend side of the registration process for a user.
 * 
 * This function attaches an event listener to the registration form. When the form is submitted,
 * it prevents the default form submission process, collects the form data, and sends it to the server
 * using a POST request. It handles the response by displaying success or error messages.
 */
function register() {
    // Select the DOM elements
    const form = document.getElementById('registerForm');
    const errorMessageElement = document.getElementById('errorMessage'); 
    const successMessageElement = document.getElementById('successMessage');

    // Listens for the submit event. When the form is submitted, the function will be executed
    form.addEventListener('submit', function(e) {
        
        // Prevents default submission, allows for custom processing
        e.preventDefault();

        // Clear previous success and error messages
        document.getElementById('errorMessage').textContent = '';
        document.getElementById('successMessage').textContent = '';

        const formData = new FormData(form);
        const url = form.action;
        
        // An AJAX request with POST method, using fetch API
        fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
        })
        // Response handling
        .then(response => response.json()) // Parses the response into JSON format
        .then(data => { // Data object contains the server's response 
            if(data.errors) { // Checks if contains an "errors" field
                // Accumulate all error messages into an empty string
                let allErrorMessages = '';

                // Iterates over each field in "errors"
                for (const field in data.errors) {
                    const errorMessages = data.errors[field];
                    
                    errorMessages.forEach(error => {
                        allErrorMessages += error.message + '\n';
                    });
                }
                errorMessageElement.textContent = allErrorMessages; // Put the message inside the element
                errorMessageElement.style.display = 'block'; // Ensure it's visible
            } 
            // If there are no errors in registration, display success message
            else {
                console.log('Success:', data);
                successMessageElement.textContent = 'Successfully registered. Go to Login page.';
                successMessageElement.style.display = 'block';
            }
        })
        .catch(error => {
            // Catch any network errors during the fetch request
            console.error('Error:', error);
        });
    });
}

function displayUploadedPic() {
    const input = document.getElementById('profilePic');
    const img = document.getElementById('uploadedPic');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
            img.style.display = 'block';
            img.style.width = '200px';
            img.style.height= '200px';
            img.style.objectFit = 'cover'; // Ensure the aspect ratio is maintained and the image is covered within the dimensions
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Login scripts
function goToHomePage() {
    window.location.href = "/homepage";  // Redirect to HomePage.html
}

document.addEventListener('DOMContentLoaded', function() {
    login();
});

/**
 * Handles the login form submission.
 *
 * This function prevents the default form submission process to perform an asynchronous POST request using the Fetch API.
 * It sends the form data to the server and handles the response. On a successful login, it displays a success message and
 * redirects the user to the homepage after a short delay. If the login fails, it displays an error message. Any network
 * errors encountered during the request are also caught and displayed as error messages.
 */
function login() {
    // Select form and message elements from DOM
    const loginForm = document.getElementById('loginForm');
    const errorMessageDisplay = document.getElementById('errorMessage'); 
    const successMessageElement = document.getElementById('successMessage');

    // Listens for the submit event. When the form is submitted, the function will be executed
    loginForm.addEventListener('submit', function(e) {
        // Prevents default submission, allows for custom processing
        e.preventDefault()
        
        // Clear previous messages
        document.getElementById('errorMessage').textContent = '';
        document.getElementById('successMessage').textContent = '';

        const formData = new FormData(loginForm);
        const url = loginForm.action;
        
        // An AJAX request with POST method, using fetch API
        fetch(url, {
            method: 'POST', 
            body: formData,
            headers: {
                // A security measure to prevent Cross-Site Request Forgery (CSRF) attacks.
                'X-CSRFToken': getCookie('csrftoken') 
            },
            // To ensure that user credentials or session information is included in the request after redirection
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // If login is successful
                successMessageElement.textContent = data.message + '. Redirecting to homepage.';
                successMessageElement.style.display = 'block';

                // Wait for 2 seconds before redirecting
                setTimeout(() => {
                    window.location.href = "/homepage";
                }, 2000); 

            } else if (!data.success) {
                // If there is an error message, display it
                errorMessageDisplay.textContent = data.error; // Update the text content of the error message display
                errorMessageDisplay.style.display = 'block'; // Make sure the error message is visible
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessageDisplay.textContent = error; // Update the text content of the error message display
            errorMessageDisplay.style.display = 'block'; // Make sure the error message is visible
        });
    });
};

// Wordle page scripts
function refresh() {
    /* 
      This function refreshes the page to reset the wordle puzzle
  
      This function jas no parameters and returns nothing
    */
      location.reload();
  
  }
  
  function getRandomAnswer() {
      let min = Math.ceil(1);
      let max = Math.floor(4);
      let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  
      if (randomNumber == 1) {
      answer = a
    } else if (randomNumber == 2) {
      answer = b
    } else if (randomNumber == 3) {
      answer = c
    } else {
      answer = d
    }
      
  
      return answer
  }
  
  function drawTable() {
      
    let answer = currentAnswer
  
    
    let html = '<div id="wordleContainer"><table>';
      let rows = 6
      let letterCount = answer.length;
      let cols = letterCount
  
      let counter = 0
      let wordCounter = 0
  
      for(let i = 0; i < rows; i++) {
          html += '<tr>';
          let letterCounter = -1
          for(let j = 0; j < cols; j++) {
              counter += 1
              letterCounter += 1
              let correctLetter = answer.charAt(letterCounter)
              
              html += '<td><label for="input' + counter + '">Word ' + (wordCounter+1) + ' Letter ' + (letterCounter+1) + ':</label><input oninput="CheckInput()" class="Incorrect" type="text" id="input' + counter + '" name="input' + counter + '" maxlength="1" pattern="' + answer + '" data-correct-pattern="' + correctLetter + '" placeholder=" "></td>';
  
          }
          html += '</tr>';
          wordCounter +=1
      }
  
      html += '</table></div><button onclick="refresh()" id="retrybutton">New puzzle</button><br><br><br><br><br><br><br><br>';
  
      document.body.innerHTML += html;
  }
  
  let correctWord
  function CheckInput(event) {
      wordleDiv = document.querySelector('#wordleContainer')
      if (!usagesLeft == 0) {
      
        let inputs = document.querySelectorAll('input');
    
      let rows = document.querySelectorAll('table tr');
    
      inputs.forEach(function(input) {
        const userAnswer = input.value;
        correctWord = input.getAttribute("pattern");
        const correctLetter = input.getAttribute("data-correct-pattern");
    
        let style = window.getComputedStyle(input);
        let pointerEvents = style.getPropertyValue('pointer-events');
    
        if (pointerEvents == 'none'){
    
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
        rows.forEach(function(row) {
          if (!isWinner == true) {
            // Get all the input elements in this row
            let inputs = row.querySelectorAll('input');
    
            let correctInputs = 0
    
            inputs.forEach(function(input) {
              // If this input does not have the 'Correct' class, set allCorrect to false
              if (input.classList.contains('Correct')) {
                correctInputs += 1
              }
              if (!input.value == '') {
                answeredInputs += 1
              }
              });
    
              if (correctInputs == currentAnswer.length) {
              isWinner = true
              // Create a new element, set its text to 'You win', and insert it before the first row
              
              if (usagesLeft > 1) {
                
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
              console.log(answeredInputs, currentAnswer.length*6)
              if (answeredInputs == currentAnswer.length*6 && isWinner == false) {
                
                // Create a new element, set its text to 'You win', and insert it before the first row
                
                if (usagesLeft > 1) {
                  
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
  
            } else {
              row.style.display = 'none';
              
            }
  
            if (usagesLeft == 1) {usagesLeft = 0}
        });
      
    }}
  
    function combinedOnloadFunctions() {
      /*
      This function combines the drawTable, adjustButtonMArgins, and calendarFunction functions so they can both be called when the page loads
      
  
      This function has no parameters and returns nothing
      */
    drawTable();
    adjustButtonMargins();
    calendarFunction();
  }
  
  
  let a = 'lodestone'   //9
  let b = 'foment'      //6
  let c = 'efficacious' //11
  let d = 'consternation'   //13
  
  let isWinner = false
  let usagesLeft = 2
  
  let currentAnswer = getRandomAnswer();

document.addEventListener('click', CheckInput);
document.addEventListener('keydown', CheckInput);

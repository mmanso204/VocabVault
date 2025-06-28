function adjustButtonMargins() {
    /*
    This function changes the size of the dropdown buttons and the search bar.
    It also govens the text dispaying variables in the down right corner.

    This function has no parameters and returns nothing
    */
    const buttons = document.querySelectorAll('.dropdown .dropbtn'); //selects all dropdown buttons
    const dropdown = document.querySelectorAll('.dropdown-content a:hover');
    const width = window.innerWidth; //grabs the width of the browser window
    const height = window.innerHeight; //grabs the height of the browser window
    const searchBar = document.querySelector('.navbar input[type= text]');
    
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
    var navbar = document.getElementById("navbar");

    var sticky = navbar.offsetTop;

    // this makes the navbar sticky when the navbar reaches the top of the screen
    if (window.scrollY >= sticky) {
        navbar.classList.add("sticky")
    
    }
    
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

window.onresize = adjustButtonMargins; //activates the adjustButtonMargins function when resizing the browser window
window.onscroll = combinedScrollFunctions; //activates the combinedScrollFunctions function when the browser loads
window.onload = combinedScrollFunctions; //activates the combinedScrollFunctions function when scrolling

function initializeCalendar() {
    /*  
    This function creates and initializes a callendar using the Fullcallendar javascript library.
  
    This function has no parameters and returns the created library.
    */
  
    // Get the html element that the calendar will be rendered
/**
 * Initializes and returns a FullCalendar instance attached to a specified HTML element.
 * The calendar is configured with basic options. It also defines an
 * eventClick handler to open event URLs in a new window.
 * 
 * @returns {FullCalendar.Calendar} A FullCalendar.Calendar instance.
 */
function initializeCalendar() {
    // Get the html element that the calendar will be rendered
        var calendarEl = document.getElementById('calendar');
    
    // Create a new instance of FullCalendar.Calendar 
        
    // Create a new instance of FullCalendar.Calendar 
    var calendar = new FullCalendar.Calendar(calendarEl, {
        // Pass some options
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
            
        // This function opens the event's URL in a new window and prevents the default action for the click event.
        eventClick: function(info) {        
                window.open(info.event.url);
                info.jsEvent.preventDefault();
            }
        });
    return calendar;
}
    return calendar;
  }
  
/**
 * Sets up the calendar modal functionality including displaying the modal, initializing
 * the calendar, rendering it, and handling the modal close actions. It also defines an
 * AJAX GET request to '/get_words/' to fetch and update the calendar events dynamically.
 */
  function calendarFunction() {
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
        // Click on the anywhere on the modal but not the content.
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  }

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
 * Displays the selected profile picture in the `<img>` element with the ID 'profilePic'.
 * This function is triggered when a new file is selected in the input element with the ID 'photo'.
 * It reads the selected file as a Data URL and sets it as the source of the 'profilePic' image,
 * making the image visible if it was previously hidden.
 */
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

/* USER INFORMATION CHANGE FUNCTIONS */
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

/**
 * Toggles the edit mode on the user account page. When edit mode is enabled, it hides the display elements
 * (username, email, and profile picture) and shows the corresponding input fields for these elements, allowing
 * the user to edit their information. It also changes the text and background color of the change button to
 * indicate a cancel action. When edit mode is disabled, it reverts these changes, showing the display elements
 * and hiding the input fields, and resets the change button to its original state.
 */
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

/**
 * Saves the changes made to the user's information by sending a POST request with the updated username,
 * email, and profile picture to the server. It constructs a FormData object with the new values and sends
 * it as the request body. If the update is successful, it toggles off the edit mode and reloads the page.
 * In case of an error, it displays an error message to the user. This function also handles network errors
 * or server unreachability by displaying a generic error message.
 */  
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
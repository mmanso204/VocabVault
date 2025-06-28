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

/**
 * Initializes and returns a FullCalendar instance attached to a specified HTML element.
 * The calendar is configured with basic options. It also defines an
 * eventClick handler to open event URLs in a new window.
 * 
 * @returns {FullCalendar.Calendar} A FullCalendar.Calendar instance.
 */
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
window.onresize = adjustButtonMargins; //activates the adjustButtonMargins function when resizing the browser window
window.onload = combinedScrollFunctions; //activates the combinedScrollFunctions function when the browser loads
window.onscroll = combinedScrollFunctions; //activates the combinedScrollFunctions function when scrolling

/**
 * Redirects the user to the homepage by changing the current window's location.
 */
function goToHomePage() {
    /* 
    redirects the user to the home page
    
    This function has no parameters and returns nothing
    */
    window.location.href = "/homepage";  // Redirect to HomePage.html
  }

document.addEventListener('DOMContentLoaded', function() {
    register();
    displayUploadedPic();
});

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

/**
 * Updates the source of the 'uploadedPic' image element with the user-selected file from 'profilePic' input,
 * making it visible with specified styles.
 */
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
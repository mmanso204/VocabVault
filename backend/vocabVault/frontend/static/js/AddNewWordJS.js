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
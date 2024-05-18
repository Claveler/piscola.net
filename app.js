// Grab the shit I need from the DOM first ---

const addSourceModal = document.querySelector(".add-venues-form")
const headerButton = document.getElementById("add-source")
const barsButton = document.getElementById("bars-button");
const storesButton = document.getElementById("stores-button");
const mapContainer = document.querySelector(".map-container");
const showMapButton = document.querySelector(".show-map-button");
const navLinks = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");
const mediaQuery = window.matchMedia('(min-width: 830px)');

// On to the functions that deal with the modal to add new piscola sources ---

function openAddSourceModal() {
    // document.getElementById("add-source").textContent = "Fuck yeah, bro!";
    addSourceModal.showModal();
}

function closeAddSourceModal() {
    // headerButton.textContent = "Add a piscola source";
    addSourceModal.close();
}

addSourceModal.addEventListener("click", e => {
    const dialogDimensions = addSourceModal.getBoundingClientRect()
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {     closeAddSourceModal()}
})

// Functionality for the hamburger menu
hamburger.addEventListener("click", () => {
    const currentTransform = window.getComputedStyle(navLinks).transform;
    if (currentTransform === 'matrix(1, 0, 0, 1, 0, 0)') {
        navLinks.style.transform = 'translate(225px, 0px)';
    } else {
        navLinks.style.transform = 'translate(0px, 0px)';
    }
});

// Functionality to show map when in mobile mode

showMapButton.addEventListener("click", () => {
    if (mapContainer.style.display === "none" || mapContainer.style.display === "") {
        showMap();
    } else if (mapContainer.style.display === "block") {
       hideMap(); 
    }   
});

    // This is for when resizing the screen
    function handleViewportChange(event) {
        if (event.matches) {
            showMap();
        } else {
            hideMap();
        }
    }

    mediaQuery.addEventListener('change', handleViewportChange);

    // Initial check
    handleViewportChange(mediaQuery);

function showMap () {
    mapContainer.style.display = "block";
    showMapButton.innerHTML = 'Hide &nbsp<i class="fa-solid fa-map-location-dot"></i>';
    console.log("Map shown");
}

function hideMap () {
    mapContainer.style.display = "none";
    showMapButton.innerHTML = 'Show &nbsp<i class="fa-solid fa-map-location-dot"></i>';
    console.log("Map hidden");
}


// Function to fetch venues from the JSON file
async function fetchVenues() {
    try {
        const response = await fetch('venues.json') // Ensure the path to your JSON file is correct
            ;
        if (!response.ok) {
            throw new Error('Failed to fetch venues: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching venues:', error);
        throw error;
    }
}

// Function to display venues
function displayVenues(type = "Bar/Pub", venues) {
    const venueContainer = document.querySelector(".venues");
    const addVenuesPrompt = document.querySelector(".add-venues-prompt");
    const loadMoreButton = document.querySelector(".load-more-button");

    venueContainer.innerHTML = addVenuesPrompt ? addVenuesPrompt.outerHTML : "";  // Keep the add venues prompt

    venues.filter(venue => venue.type === type).forEach(venue => {
        const drinksList = venue.drinks.map(drink => `<li>${drink.name} | <b>${drink.price}</b></li>`).join('');
        const venueHTML = `
            <div class="venue-card">
                <div class="venue-card-img" style="background-image: url(${venue.imageUrl})"></div>
                <div class="venue-card-info">
                    <div class="venue-card-info-text">
                        <h3>${venue.name}</h3>
                        <p>${venue.type}</p>
                        <p>${venue.address}</p>
                    </div>
                    <ul class="venue-card-pisco-pills">${drinksList}</ul>
                </div>
                <div class="upvoting-ui">
                    <button class="upvoting-button" onclick="increaseRating(${venue.id})" title="Increase rating"><i class='bx bxs-upvote'></i></button>
                    <p class="current-rating">${formatLikes(venue.likes)}</p>
                    <button class="upvoting-button" onclick="decreaseRating(${venue.id})" title="Decrease rating"><i class='bx bxs-downvote'></i></button>
                </div>
            </div>
        `;
        venueContainer.innerHTML += venueHTML;
    });
    venueContainer.innerHTML += loadMoreButton ? loadMoreButton.outerHTML : "";
}

// Load and display venues when the DOM is fully loaded ---
document.addEventListener('DOMContentLoaded', () => {
    fetchVenues().then(venues => {
        displayVenues("Bar/Pub", venues);
    });
    barsButton.style.color = "white";
    barsButton.style.fontWeight = "600";
    storesButton.style.color = "var(--accent-color)";
    storesButton.style.fontWeight = "400";

    // This gets the computed width of the bars button. I use 0 width to offset the slider, and the bars width to set its width.
    const barsButtonWidth = window.getComputedStyle(barsButton).getPropertyValue("width");

    barsButton.style.setProperty('--type-slider-width-prop',barsButtonWidth);
    barsButton.style.setProperty('--type-slider-left-prop','0px');
});

// Generic type filter function. Just for testing purposes ---
function typeFilter(type) {
    fetchVenues().then(venues => {
        displayVenues(type, venues);
    })
}

// Give the type selectors the filter functionality, using addEventListener instead of the generic type filter function ---
barsButton.addEventListener("click", () => {
    fetchVenues().then(venues => {
        displayVenues("Bar/Pub", venues);
    });
    barsButton.style.color = "white";
    barsButton.style.fontWeight = "600";
    storesButton.style.color = "var(--accent-color)";
    storesButton.style.fontWeight = "400";

    // This gets the computed width of the bars button. I use 0 width to offset the slider, and the bars width to set its width.
    const barsButtonWidth = window.getComputedStyle(barsButton).getPropertyValue("width");

    barsButton.style.setProperty('--type-slider-width-prop',barsButtonWidth);
    barsButton.style.setProperty('--type-slider-left-prop','0px');
});

storesButton.addEventListener("click", () => {
    fetchVenues().then(venues => {
        displayVenues("Liquor Store", venues);
    });
    barsButton.style.color = "var(--accent-color)";
    barsButton.style.fontWeight = "400";
    storesButton.style.color = "white";
    storesButton.style.fontWeight = "600";
    
    // This gets the computed width of the bars and the stores button. I use the bars width to offset the slider, and the stores' to set its width.
    const storesButtonWidth = window.getComputedStyle(storesButton).getPropertyValue("width");
    const barsButtonWidth = window.getComputedStyle(barsButton).getPropertyValue("width");

    barsButton.style.setProperty('--type-slider-width-prop',storesButtonWidth);
    barsButton.style.setProperty('--type-slider-left-prop',barsButtonWidth);

    // typeSlider.style.left = "50%";

    // barsButton.classList.value = "type-btn"
    // storesButton.classList.value = "type-btn selected"
});

function formatLikes(likes) {
    // Optionally, format the likes number to a more readable format if needed
    return likes >= 1000 ? `${(likes/1000).toFixed(1)}k` : likes;
}

// These functions shall handle the upvoting behaviour ---

function increaseRating(venueId) {
    // Implement logic to increase rating
    console.log(`Increasing rating for venue ${venueId}`);
}

function decreaseRating(venueId) {
    // Implement logic to decrease rating
    console.log(`Decreasing rating for venue ${venueId}`);
}

// These are just test functions ---

function testFunction () {
    alert("Hello World!")
}

console.log(storesButton.clientWidth);
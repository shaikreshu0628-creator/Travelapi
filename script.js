const container = document.getElementById("places");
const searchBox = document.getElementById("searchBox");

let favorites =
JSON.parse(localStorage.getItem("favorites")) || [];

const touristPlaces = [

    { name: "Taj Mahal", country: "India", city: "Agra" },
    { name: "Agra Fort", country: "India", city: "Agra" },
    { name: "Charminar", country: "India", city: "Hyderabad" },
    { name: "Golconda Fort", country: "India", city: "Hyderabad" },
    { name: "Ramoji Film City", country: "India", city: "Hyderabad" },
    { name: "Hussain Sagar", country: "India", city: "Hyderabad" },
    { name: "Mysore Palace", country: "India", city: "Mysore" },
    { name: "Hampi", country: "India", city: "Hampi" },
    { name: "Ooty", country: "India", city: "Ooty" },
    { name: "Goa", country: "India", city: "Goa" },
    { name: "Jaipur", country: "India", city: "Jaipur" },
    { name: "Amber Fort", country: "India", city: "Jaipur" },
    { name: "Manali", country: "India", city: "Manali" },
    { name: "Shimla", country: "India", city: "Shimla" },
    { name: "Darjeeling", country: "India", city: "Darjeeling" },

    { name: "Eiffel Tower", country: "France", city: "Paris" },
    { name: "Louvre Museum", country: "France", city: "Paris" },
    { name: "Palace of Versailles", country: "France", city: "Versailles" },

    { name: "Big Ben", country: "United Kingdom", city: "London" },
    { name: "London Eye", country: "United Kingdom", city: "London" },
    { name: "Tower Bridge", country: "United Kingdom", city: "London" },

    { name: "Colosseum", country: "Italy", city: "Rome" },
    { name: "Trevi Fountain", country: "Italy", city: "Rome" },
    { name: "Leaning Tower of Pisa", country: "Italy", city: "Pisa" },

    { name: "Great Wall of China", country: "China", city: "Beijing" },
    { name: "Forbidden City", country: "China", city: "Beijing" },

    { name: "Mount Fuji", country: "Japan", city: "Tokyo" },
    { name: "Tokyo Tower", country: "Japan", city: "Tokyo" },
    { name: "Osaka Castle", country: "Japan", city: "Osaka" },

    { name: "Burj Khalifa", country: "UAE", city: "Dubai" },
    { name: "Palm Jumeirah", country: "UAE", city: "Dubai" },
    { name: "Museum of the Future", country: "UAE", city: "Dubai" },

    { name: "Statue of Liberty", country: "USA", city: "New York" },
    { name: "Times Square", country: "USA", city: "New York" },
    { name: "Central Park", country: "USA", city: "New York" },
    { name: "Golden Gate Bridge", country: "USA", city: "San Francisco" },

    { name: "Sydney Opera House", country: "Australia", city: "Sydney" },
    { name: "Sydney Harbour Bridge", country: "Australia", city: "Sydney" },

    { name: "Christ the Redeemer", country: "Brazil", city: "Rio de Janeiro" },
    { name: "Machu Picchu", country: "Peru", city: "Cusco" },
    { name: "Petra", country: "Jordan", city: "Petra" },
    { name: "Angkor Wat", country: "Cambodia", city: "Siem Reap" }
];

// Load Places
async function loadPlaces(list) {

    container.innerHTML =
    "<div class='loading'>Loading Places...</div>";

    let html = "";

    for (const place of list) {

        try {

            const response = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place.name)}`
            );

            const data = await response.json();

            const image =
                data.thumbnail?.source ||
                `https://picsum.photos/800/500?random=${Math.random()}`;

            const description =
                data.extract ||
                "Popular tourist destination.";

            const mapLink =
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;

            const wikiLink =
                data.content_urls?.desktop?.page || "#";

            const isFav =
                favorites.includes(place.name);

            html += `
            <div class="card">

                <img
                src="${image}"
                alt="${place.name}"
                onerror="this.src='https://picsum.photos/800/500?random=${Math.random()}'">

                <div class="card-content">

                    <h3>${place.name}</h3>

                    <p>
                        <strong>Country:</strong> ${place.country}<br>
                        <strong>City:</strong> ${place.city}
                    </p>

                    <p>
                        ${description.substring(0,180)}...
                    </p>

                    <div class="actions">

                        <button
                        class="fav-btn"
                        onclick="toggleFav('${place.name}')">
                        ${isFav ? "💔 Remove" : "❤️ Favorite"}
                        </button>

                        <button
                        class="read-btn"
                        onclick="window.open('${wikiLink}','_blank')">
                        Read More
                        </button>

                        <button
                        class="read-btn"
                        onclick="window.open('${mapLink}','_blank')">
                        🗺️ Map
                        </button>

                    </div>

                </div>

            </div>
            `;

        } catch (error) {
            console.error(error);
        }
    }

    container.innerHTML = html;
}

// Favorites
function toggleFav(place) {

    if (favorites.includes(place)) {
        favorites = favorites.filter(p => p !== place);
    } else {
        favorites.push(place);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadPlaces(touristPlaces);
}

function showFavorites() {

    const favPlaces =
    touristPlaces.filter(place =>
        favorites.includes(place.name)
    );

    if (favPlaces.length === 0) {

        container.innerHTML =
        "<div class='loading'>No Favorites Added ❤️</div>";

        return;
    }

    loadPlaces(favPlaces);
}

function showAll() {
    loadPlaces(touristPlaces);
}

searchBox.addEventListener("input", (e) => {

    const query = e.target.value.trim().toLowerCase();

    // Show all places when search box is empty
    if(query === ""){
        loadPlaces(touristPlaces);
        return;
    }

    const filtered = touristPlaces.filter(place =>

        place.name.toLowerCase().includes(query) ||
        place.city.toLowerCase().includes(query) ||
        place.country.toLowerCase().includes(query)

    );

    // Not Found Message
    if(filtered.length === 0){

        container.innerHTML = `
            <div class="not-found">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                    alt="Not Found"
                    width="180"
                >

                <h2>❌ Place Not Found</h2>

                <p>
                    No tourist places available for
                    "<strong>${e.target.value}</strong>"
                </p>

                <p>
                    Try searching by:
                    <br>
                    • Country (India, France, USA)
                    <br>
                    • City (Hyderabad, Paris, London)
                    <br>
                    • Tourist Place (Taj Mahal, Eiffel Tower)
                </p>
            </div>
        `;

        return;
    }

    loadPlaces(filtered);

});
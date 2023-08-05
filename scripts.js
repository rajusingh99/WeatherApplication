const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const weatherCardsContainer = document.getElementById('weatherCards');
const cityInput = document.getElementById('cityInput');
const addButton = document.getElementById('addButton');
let cities = new Set();

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to create a weather card element
function createWeatherCard(cityData) {
    const { name, weather, main, wind, clouds, sys } = cityData;
    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weather-icon');
    weatherIcon.src = `http://openweathermap.org/img/w/${weather[0].icon}.png`;

    const weatherDetails = document.createElement('div');
    weatherDetails.classList.add('weather-details');
    weatherDetails.innerHTML = `
        <h2>${name}</h2>
        <p>${weather[0].description}</p>
        <p>Temperature: ${main.temp}°C (High: ${main.temp_max}°C, Low: ${main.temp_min}°C)</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Pressure: ${main.pressure} hPa</p>
        <p>Wind: ${wind.speed} m/s, ${wind.deg}°</p>
        <p>Cloudiness: ${clouds.all}%</p>
        <p>Country: ${sys.country}</p>
    `;

    weatherCard.appendChild(weatherIcon);
    weatherCard.appendChild(weatherDetails);

    return weatherCard;
}

// Function to add a city and update the dashboard
function addCity() {
    const cityName = cityInput.value.trim();
    if (!cityName || cities.has(cityName.toLowerCase())) {
        alert('City is empty or already added.');
        return;
    }

    fetchWeatherData(cityName)
        .then((data) => {
            cities.add(cityName.toLowerCase());
            const weatherCard = createWeatherCard(data);
            weatherCardsContainer.appendChild(weatherCard);
            cityInput.value = '';
            sortCitiesByTemperature();
        })
        .catch((error) => {
            alert('City not found. Please try again.');
            console.error(error);
        });
}

// Function to sort cities by temperature
function sortCitiesByTemperature() {
    const cards = Array.from(weatherCardsContainer.children);
    cards.sort((a, b) => {
        const tempA = parseFloat(a.querySelector('.weather-details p:nth-child(3)').textContent.match(/\d+/));
        const tempB = parseFloat(b.querySelector('.weather-details p:nth-child(3)').textContent.match(/\d+/));
        return tempA - tempB;
    });

    weatherCardsContainer.innerHTML = '';
    cards.forEach(card => weatherCardsContainer.appendChild(card));
}

// Event listener for the "Add" button
addButton.addEventListener('click', addCity);

// Event listener to handle "Enter" key press in the input field
cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addCity();
    }
});

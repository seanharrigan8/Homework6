
// the DOM selectors
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const currentWeather = document.getElementById('current-weather');
const forecastWeather = document.getElementById('forecast-weather');
const historyContainer = document.getElementById('search-history');

// FETCH function to get the coordinates.
function getCoordinates(cityName) {
  const apiKey = 'c4a2a6d84fa6b9b0cd24e083d620ae71';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { lat, lon } = data.coord;
      getWeatherForecast(lat, lon); 
      updateCurrentWeather(data);
    })
    .catch(error => console.error('Error fetching coordinates:', error));
}

//5-day forecast fuction with fetch
function getWeatherForecast(lat, lon) {
  const apiKey = 'c4a2a6d84fa6b9b0cd24e083d620ae71';
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateForecastWeather(data);
     })
    .catch(error => console.error('Error fetching forecast:', error));
}

//updates to current
function updateCurrentWeather(data) {
  currentWeather.innerHTML = `Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C, Description: ${data.weather[0].description}, Humidity: ${data.main.humidity}%`;
}

// Function to update the DOM with forecast weather data. also adjusts kelvin to C and F.
function updateForecastWeather(data) {
  forecastWeather.innerHTML = '';
  data.list.forEach((forecast, index) => {
    if (index % 8 === 0) {
      const temp = `${(forecast.main.temp - 273.15).toFixed(2)}°C`;
      const tempFahrenheit = ((forecast.main.temp - 273.15) * 9/5 + 32).toFixed(2); 
      const description = forecast.weather[0].description;
      const humidity = `Humidity: ${forecast.main.humidity}%`;
      const forecastCard = `<div>${temp}, ${tempFahrenheit}, ${description}, ${humidity}</div>`;
      forecastWeather.innerHTML += forecastCard;
    }
  });
}

// searchButton event listener. 
searchButton.addEventListener('click', () => {
  const cityName = searchInput.value;
  getCoordinates(cityName);
  saveToHistory(cityName);
  updateSearchHistory();
  searchInput.value = ''; // Clear the search input
});

// localStorage function 
function saveToHistory(cityName) {
  let history = localStorage.getItem('searchHistory');
  history = history ? JSON.parse(history) : [];
  if (!history.includes(cityName)) {
    history.push(cityName);
  }
  localStorage.setItem('searchHistory', JSON.stringify(history));
}

// //creates "history Container" which is adjusted based on recent search history//
function updateSearchHistory() {
  let history = localStorage.getItem('searchHistory');
  history = history ? JSON.parse(history) : [];
  historyContainer.innerHTML = '';
  history.forEach(cityName => {
    const historyEntry = document.createElement('button');
    historyEntry.textContent = cityName;
    historyEntry.addEventListener('click', () => {
      searchInput.value = cityName;
      getCoordinates(cityName);
    });
    historyContainer.appendChild(historyEntry);
  });
}

//dashboard search history call
updateSearchHistory();




// var apiKey = "c4a2a6d84fa6b9b0cd24e083d620ae71"

// var city;

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


// fetch(queryURL)

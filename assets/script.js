var inputEl = document.querySelector('#place');
var submitBtn = document.querySelector('#submit');
var historyEl = document.querySelector('#history');
var cityTitle = document.querySelector('#city');
var weatherEl = document.querySelector('#weather');
var forecastTitle = document.querySelector('#forecast-title');
var forecastEl = document.querySelector('#forecast');

var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];

// Displays previous searches that were stored in local storage
function init() {
  for (var search of srcHistory) {
    var historyBtn = document.createElement('button');
    historyBtn.textContent = search;
    historyEl.appendChild(historyBtn);
  }
}

// Gets the geographical longitude and latitude of the city
function getLocation(city) {
  // Allow cities with spaces in their names to be inserted in the URL
  var newCity = city.replace(/ /g, "+");
  // Fetches geocode data via Open Weather Map
  // Reference: https://openweathermap.org/api/geocoding-api
  fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + newCity + '&limit=1&appid=062ac5aed23ac309d8aa8d7807a42e70')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getWeather(city, data[0].lat, data[0].lon);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Gets weather data of the city
function getWeather(city, lat, lon) {
  // Fetches weather data from OpenWeatherMap
  // Reference: https://openweathermap.org/api/one-call-api
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=062ac5aed23ac309d8aa8d7807a42e70')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Clears and resets city title
      cityTitle.textContent = '';
      // Sets city title to city and the current date
      cityTitle.textContent = city + ' — ' + moment().format("M/DD/YYYY");

      currentWeather(data);
      forecastWeather(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Displays current weather on the page
function currentWeather(data) {
  // Clears and resets element
  weatherEl.innerHTML = '';

   // Text weather data to be displayed
   var weatherData = [
    'Temp: ' + data.current.temp + '°F',
    'Wind: ' + data.current.wind_speed + ' mph',
    'Humidity: ' + data.current.humidity + '%'
  ];
  var uvIndex = data.current.uvi;

  // Creates and displays weather icon
  var weatherIcon = data.current.weather[0].icon;
  var currentIcon = document.createElement('img');
  currentIcon.setAttribute('src', 'http://openweathermap.org/img/w/' + weatherIcon + '.png');
  weatherEl.appendChild(currentIcon);

  // Creates and displays weather data
  for (var item of weatherData) {
    var weatherItem = document.createElement('p');
    weatherItem.textContent = item;
    weatherEl.appendChild(weatherItem);
  }

  // Creates a label and the UV index
  var uvLabel = document.createElement('p');
  var uvItem = document.createElement('button');

  // Aligns the label and the UV index on the same line
  uvLabel.style.display ='inline';

  // Colors the UV Index according to the conditions
  // Disables the button so it cannot be clicked
  if (uvIndex < 3) {
    uvItem.classList.add('favorable');
    uvItem.disabled = true;
  } else if (uvIndex < 6) {
    uvItem.classList.add('moderate');
    uvItem.disabled = true;
  } else {
    uvItem.classList.add('severe');
    uvItem.disabled = true;
  }

  // Add text content of elements and append
  uvLabel.textContent = 'UV index: ';
  uvItem.textContent = uvIndex;
  weatherEl.append(uvLabel, uvItem);

  // Creates a divider between current weather and forecast
  var divider = document.createElement('hr');
  weatherEl.appendChild(divider);
}

// Displays Five Day Forecast on the Page
function forecastWeather(data) {
  // Clears and resets element and title content
  forecastEl.innerHTML = '';
  forecastTitle.textContent = '';
  forecastTitle.textContent = 'Five Day Forecast';

  // For each daily weather data index,
  for (var i = 1; i <= 5; i++) {
    // data is assigned,
    var date = data.daily[i].dt;
    var icon = data.daily[i].weather[0].icon;
    var temp = 'Temp: ' + data.daily[i].temp.day + '°F';
    var wind = 'Wind: ' + data.daily[i].wind_speed + ' mph';
    var humidity = 'Humidity: ' + data.daily[i].humidity + '%';

    // and elements are created.
    var forecastCard = document.createElement('article');
    var dateItem = document.createElement('h3');
    var iconItem = document.createElement('img');
    var tempItem = document.createElement('p');
    var windItem = document.createElement('p');
    var humidityItem = document.createElement('p');

    // Each element is assigned to its specific data,
    dateItem.textContent = moment(date, "X").format("M/DD/YYYY");
    iconItem.setAttribute('src', 'http://openweathermap.org/img/w/' + icon + '.png');
    tempItem.textContent = temp;
    windItem.textContent = wind;
    humidityItem.textContent = humidity;

    // then appended to its card
    forecastCard.appendChild(dateItem);
    forecastCard.appendChild(iconItem);
    forecastCard.appendChild(tempItem);
    forecastCard.appendChild(windItem);
    forecastCard.appendChild(humidityItem);

    // before being displayed on the page;
    forecastEl.appendChild(forecastCard);
  }
}

// The submit button of the form saves the city into local storage
// and creates a button in search history if the city has not been searched before.
submitBtn.addEventListener('click', function (event) {
  event.preventDefault();

  var cityInput = inputEl.value.trim();
  var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];

  if (!srcHistory.includes(cityInput)) {
    var historyBtn = document.createElement('button');
    historyBtn.textContent = cityInput;
    historyEl.appendChild(historyBtn);
    srcHistory.push(cityInput);
    localStorage.setItem('srcHistory', JSON.stringify(srcHistory));
  }

  getLocation(cityInput);
  inputEl.value = '';
})

// Alternative to the form in order to call getLocation to getWeather
historyEl.addEventListener('click', function (event) {
  event.preventDefault();
  var historyBtn = event.target;
  if (historyBtn.matches('button')) {
    getLocation(historyBtn.textContent);
  }
})

init();
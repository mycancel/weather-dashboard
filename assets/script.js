var inputEl = document.querySelector('#place');
var submitBtn = document.querySelector('#submit');
var historyEl = document.querySelector('#history');
var cityTitle = document.querySelector('#city');
var weatherEl = document.querySelector('#weather');
var forecastEl = document.querySelector('#forecast');

var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];

function init() {
  for (var search of srcHistory) {
    var historyBtn = document.createElement('button');
    historyBtn.textContent = search;
    historyEl.appendChild(historyBtn);
  }
}

function getLocation(city) {
  var newCity = city.replace(/ /g, "+");
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

function getWeather(city, lat, lon) {
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=062ac5aed23ac309d8aa8d7807a42e70')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      cityTitle.textContent = '';
      cityTitle.textContent = city;
      currentWeather(data);
      forecastWeather(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function currentWeather(data) {
  weatherEl.innerHTML = '';

  var weatherIcon = data.current.weather[0].icon;
  var currentIcon = document.createElement('img');
  currentIcon.setAttribute('src', 'http://openweathermap.org/img/w/' + weatherIcon + '.png');
  weatherEl.appendChild(currentIcon);

  var weatherData = [
    'Temp: ' + data.current.temp + '°F',
    'Wind: ' + data.current.wind_speed + ' mph',
    'Humidity: ' + data.current.humidity + '%'
  ];
  var uvIndex = data.current.uvi;

  for (var item of weatherData) {
    var weatherItem = document.createElement('p');
    weatherItem.textContent = item;
    weatherEl.appendChild(weatherItem);
  }

  var uvLabel = document.createElement('p');
  var uvItem = document.createElement('button');
  uvLabel.textContent = 'UV index: ';
  uvItem.textContent = uvIndex;
  weatherEl.append(uvLabel, uvItem);
}

function forecastWeather(data) {
  forecastEl.innerHTML = '';

  for (var i = 1; i <= 5; i++) {
    var date = data.daily[i].dt;
    var icon = data.daily[i].weather[0].icon;
    var temp = 'Temp: ' + data.daily[i].temp.day + '°F';
    var wind = 'Wind: ' + data.daily[i].wind_speed + ' mph';
    var humidity = 'Humidity: ' + data.daily[i].humidity + '%';

    var forecastCard = document.createElement('article');
    var dateItem = document.createElement('h3');
    var iconItem = document.createElement('img');
    var tempItem = document.createElement('p');
    var windItem = document.createElement('p');
    var humidityItem = document.createElement('p');

    dateItem.textContent = date;
    iconItem.setAttribute('src', 'http://openweathermap.org/img/w/' + icon + '.png');
    tempItem.textContent = temp;
    windItem.textContent = wind;
    humidityItem.textContent = humidity;

    forecastCard.appendChild(dateItem);
    forecastCard.appendChild(iconItem);
    forecastCard.appendChild(tempItem);
    forecastCard.appendChild(windItem);
    forecastCard.appendChild(humidityItem);

    forecastEl.appendChild(forecastCard);
  }
}


submitBtn.addEventListener('click', function (event) {
  event.preventDefault();

  var cityInput = inputEl.value.trim();
  var historyBtn = document.createElement('button');
  historyBtn.textContent = cityInput;
  historyEl.appendChild(historyBtn);

  var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];
  srcHistory.push(cityInput);
  localStorage.setItem('srcHistory', JSON.stringify(srcHistory));

  getLocation(cityInput);
  inputEl.value = '';
})

historyEl.addEventListener('click', function (event) {
  event.preventDefault();
  var historyBtn = event.target;
  if (historyBtn.matches('button')) {
    getLocation(historyBtn.textContent);
  }
})

init();
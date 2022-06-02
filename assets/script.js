var inputEl = document.querySelector('#place');
var submitBtn = document.querySelector('#submit');
var historyEl = document.querySelector('#history');
var weatherEl = document.querySelector('#weather');
var cityTitle = document.querySelector('#city');

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

      var weatherIcon = data.current.weather[0].icon;
      var weatherData = [
        'Temp: ' + data.current.temp + "°F",
        'Wind: ' + data.current.wind_speed + ' mph',
        'Humidity: ' + data.current.humidity + '%'
      ];
      var uvIndex = data.current.uvi;

      cityTitle.textContent = city;
      var currentIcon = document.createElement('img');
      currentIcon.setAttribute('src', 'http://openweathermap.org/img/w/' + weatherIcon + '.png');
      weatherEl.appendChild(currentIcon);

      for (var item of weatherData ) {
        var weatherItem = document.createElement('p');
        weatherItem.textContent = item;
        weatherEl.appendChild(weatherItem);
      }
      var uvLabel = document.createElement('p');
      var uvEl = document.createElement('button');
      uvLabel.textContent = 'UV index: ';
      uvEl.textContent = uvIndex;
      weatherEl.append(uvLabel, uvEl);
    })
    .catch(function (err) {
      console.log(err);
    });
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
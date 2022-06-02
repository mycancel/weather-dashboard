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
    cityTitle.textContent = city;
    // Note to self: how to find weather in city with spaces in it (Washington DC, Las Vegas, etc)
    var newCity = city.replace(/ /g, "");
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + newCity + '&limit=1&appid=062ac5aed23ac309d8aa8d7807a42e70')
    .then(function(response) {
      return response.json();
    })
    .then(function (data) {
        getWeather(data[0].lat, data[0].lon);
    })
    .catch(function (err) {
      console.log(err);
    }); 
}

function getWeather(lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,daily,hourly,alerts&units=imperial&appid=062ac5aed23ac309d8aa8d7807a42e70')
    .then(function(response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    //   Remember to display an icon for the weather data.current.weather[0].icon
      var weatherData = {
        temp: data.current.temp,
        wind: data.current.wind_speed,
        humidity: data.current.humidity,
        uvi: data.current.uvi,
      };
      console.log(weatherData);
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
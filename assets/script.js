var inputEl = document.querySelector('#place');
var submitBtn = document.querySelector('#submit');
var historyEl = document.querySelector('.history');

var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];

function init() {
    for (var search of srcHistory) {
        var historyBtn = document.createElement('button');
        historyBtn.textContent = search;
        historyEl.appendChild(historyBtn);
    }
}

submitBtn.addEventListener('click', function (event) {
    event.preventDefault();

    var cityInput = inputEl.value;
    var historyBtn = document.createElement('button');
    historyBtn.textContent = cityInput;
    historyEl.appendChild(historyBtn);

    var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];
    srcHistory.push(cityInput);
    localStorage.setItem('srcHistory', JSON.stringify(srcHistory));

    inputEl.value = '';
})

historyEl.addEventListener('click', function (event) {
    event.preventDefault();
    var historyBtn = event.target;
    if (historyBtn.matches('button')) {
        console.log(historyBtn.textContent);
    }
})

init();
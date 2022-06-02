var inputEl = document.querySelector('#place');
var submitBtn = document.querySelector('#submit');
var historyEl = document.querySelector('.history');

var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];

submitBtn.addEventListener('click', function(event){
    event.preventDefault();
    
    var cityInput = inputEl.value; 

    var srcHistory = JSON.parse(localStorage.getItem('srcHistory')) || [];
    srcHistory.push(cityInput);
    localStorage.setItem('srcHistory', JSON.stringify(srcHistory));

    inputEl.value = '';
})
var inputEl = document.querySelector('#place');
var submitBtn = document.querySelector('#submit');
var historyEl = document.querySelector('.history');

submitBtn.addEventListener('click', function(event){
    event.preventDefault();
    console.log('hello');
})
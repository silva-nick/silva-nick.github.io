var header = document.querySelector('h1');
header.onclick = function(){
    header.textContent += '!';
}

var mainImage = document.querySelector('img');
mainImage.onclick = function(){
    var src = mainImage.getAttribute('src');
    if(src === 'images/bumbler.jpeg'){
        mainImage.setAttribute('src', 'images/dku.jpg');
    } else {
        mainImage.setAttribute('src', 'images/bumbler.jpeg');
    }
}

var userBtn = document.querySelector('button');
var title = document.querySelector('title');

function setUserName(){
    var name = prompt('What is your name?');
    localStorage.setItem('name', name);
}

if(!localStorage.getItem('name')){
    setUserName();
} else {
    var name = localStorage.getItem('name');
    title.textContent = 'Bees Welcome ' + name;
}

userBtn.onclick = setUserName;

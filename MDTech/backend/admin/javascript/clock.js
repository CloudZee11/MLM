function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    
    hours = padZero(hours);
    minutes = padZero(minutes);
    seconds = padZero(seconds);

    
    var clockDisplay = hours + ":" + minutes + ":" + seconds;
    document.getElementById("clock").innerText = clockDisplay;
}


function padZero(number) {
    return (number < 10 ? "0" : "") + number;
}


setInterval(updateClock, 1000);


updateClock();

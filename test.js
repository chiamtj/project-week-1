const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const timeX = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
console.log (timeX);

const newTime = new Date(timeX);
console.log(newTime);

let h = newTime.getHours();
let m = newTime.getMinutes();
let s = newTime.getSeconds();
let session = "AM";
let day = weekDay[newTime.getDay()];

if(h == 0){
    h = 12;
}

if(h > 12){
    h = h - 12;
    session = "PM";
}

h = (h < 10) ? "0" + h : h;
m = (m < 10) ? "0" + m : m;
s = (s < 10) ? "0" + s : s;

let localTime = day + " " + h + ":" + m + ":" + s + " " + session;
console.log(localTime);
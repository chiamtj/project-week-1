const locationArray = [
    {city:"singapore", display:"Singapore", timeZone: "Asia/Singapore"},
    {city:"sydney", display:"Sydney", timeZone: "Australia/Sydney"}, 
    {city:"tokyo", display:"Tokyo", timeZone: "Asia/Tokyo"}, 
    {city:"london", display:"London", timeZone: "Europe/London"},
    {city:"frankfurt", display:"Frankfurt", timeZone: "Europe/Berlin"},
    {city:"newyork", display:"New York", timeZone: "America/New_York"},
];

const activeClocks = [];

const addButton = document.getElementById("add");
addButton.addEventListener("click", btnClick);
const delButton = document.getElementById("remove");
delButton.addEventListener("click", deleteClock);

function deleteClock(e) {
  e.preventDefault();
  const option = document.getElementById("location");
  if (activeClocks.indexOf(option.value) === -1) {
    window.alert ("No such clock!");
    return;
  }
  let deleteDiv = document.getElementById(`${option.value}-clock`);
  while (deleteDiv.lastElementChild) {
    deleteDiv.removeChild(deleteDiv.lastElementChild);
  }
  document.getElementById(`${option.value}-clock`).remove();
  let cityIndex = activeClocks.indexOf(option.value);
  activeClocks.splice(cityIndex, 1);
}

function btnClick(e) {
  e.preventDefault();
  const option = document.getElementById("location");
  if (activeClocks.indexOf(option.value) !== -1) {
    window.alert ("Clock already in use!");
    return;
  }
  const addDiv = document.getElementById("main");
  const displayCity = locationArray.find(o => o.city === option.value);
  
  addDiv.innerHTML += 
    `<div class="clocks" id="${option.value}-clock" ><canvas id="${option.value}" height="260" width="260"></canvas>
    <div class = "text">${displayCity.display}<img src="./src/delete.png"></div><div class="digital" id="${option.value}2"></div>  </div>`;
  
  activeClocks.push(option.value);
  digitalClock(option.value+2, displayCity.timeZone);
  activateClocks();
  // worldClock(option.value);

}

function digitalClock(pId,zone) {
    //Determine Local Time 
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const foreignDateObj = new Date().toLocaleString('en-US', { timeZone: zone });
    // const localTimeZone = dateObj.toLocaleString('en-US', { timeZone: zone });
    // console.log (localTimeZone);
    const localTimeObj = new Date(foreignDateObj);

    let h = localTimeObj.getHours();
    let m = localTimeObj.getMinutes();
    let s = localTimeObj.getSeconds();
    let session = "AM";
    let day = weekDay[localTimeObj.getDay()];

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
    document.getElementById(pId).innerText = localTime;
    setTimeout(()=>{digitalClock(pId,zone)},1000);
}

function worldClock(city) {
  let canvas = document.getElementById(city);
  let ctx = canvas.getContext("2d");
  let radius = canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.90
  setInterval(()=> {
    drawClock(ctx, radius, city)
  }, 1000);
}

function activateClocks() {
  for (const val of activeClocks) {
    worldClock(val);
  }
}

function drawClock(ctx, radius, location) {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius, location);
  
}

function drawFace(ctx, radius) {
  let grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#222';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  let ang;
  let num;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius, location){
  const displayCity = locationArray.find(o => o.city === location);
  const foreignDateObj = new Date().toLocaleString('en-US', { timeZone: displayCity.timeZone });
  const localTimeObj = new Date(foreignDateObj);
  
  let hour = localTimeObj.getHours();
  let minute = localTimeObj.getMinutes();
  let second = localTimeObj.getSeconds();

  //hour
  hour=hour%12;
  hour=(hour*Math.PI/6)+
  (minute*Math.PI/(6*60))+
  (second*Math.PI/(360*60));
  drawHand(ctx, hour, radius*0.5, radius*0.07);
  //minute
  minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
  drawHand(ctx, minute, radius*0.8, radius*0.07);
  // second
  second=(second*Math.PI/30);
  drawHand(ctx, second, radius*0.9, radius*0.02);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
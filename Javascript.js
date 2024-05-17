let canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const img = new Image();
img.src = "spr_bike2man_0.png";
const img2 = new Image();
img2.src = "spr_bike2man_045gr.png"
const BackImg = new Image()
BackImg.src ="skybackground.jpg"
let context = canvas.getContext("2d");

let bike = {
  width: 80,
  height: 80,
  posX: canvas.width / 2,
  posY: 0,
  speedY: 0,
  rot: 0,
  speedR: 0,
};
let acc = 1;
let drive = false;
let dPress = false;
let aPress = false
let grounded = false;
let dead = false


document.onkeydown = function (e) {
  const key = e.key;
  switch (key) {
    case "a":
      aPress = true
      
      break;

    case "d":
      if (!dead){
      drive = true;
      dPress = true;
      }
      break;
    case " ":
      if (dead){
        window.location.reload()
      }
      break
  }
};

document.onkeyup = function (e) {
  const key = e.key;
  switch (key) {
    case "a":
      t -= 0;
      aPress = false
      break;

    case "d":
      dPress = false;
      if (grounded == false) {
        drive = true;
        break;
      }
  }
};

function bikeMovement() {
  if (drive == true && dead == false) {
    t += acc;
  }
  if (grounded == true && dPress == false) {
    drive = false;
  }

  if (drive == false) {
    t += acc - 1;
  }

  if (dPress == true && grounded == true && acc < 10) {
    acc *= 1.05;
    console.log(acc);
  }
  if (dPress == false && grounded == true && acc > 1) {
    acc /= 1.05;
    console.log(acc);
  } //Har inte denna if-sats i if (drive == false sats) eftersom den ger andra physics till den här
}

function updatePosition(rect) {
  let PPh1 = canvas.height - noise(t + rect.posX) * 0.55;
  let PPh2 = canvas.height - noise(t + (rect.posX + 40)) * 0.55;

  let onGround = 0;
  if (PPh1 - 40 > rect.posY) {
    rect.speedY += 0.2;
  } else {
    rect.speedY -= (rect.posY - (PPh1 - 40)) / 2;
    rect.posY = PPh1 - 40;
    onGround = 1;
  }
  if (rect.posY < -80) {
    rect.posY = -79;
    rect.speedY = 0;
  }
  rect.posY += rect.speedY;

  if (PPh1 - 42 <= rect.posY) {
    grounded = true;
  } else {
    grounded = false;
  }

  if(dead || onGround && Math.abs(rect.rot) > (Math.PI/2)+0.1){
    dead = true
    speedR = 0
    rect.rot = Math.PI
    console.log(speedR)
    context.fillStyle = "black";
    context.font = "30px Times new roman";
    context.fillText("You Have Died", canvas.width/2-90, canvas.height/2-120)
    context.fillText("Press Space To Restart",canvas.width/2-130, canvas.height/2-75);
  }

  let angle = Math.atan2((PPh2 - 40) - rect.posY, (rect.posX + 40) - rect.posX);
  
  if (onGround == 1 && dead == false){
  rect.rot -= (rect.rot - angle) * 0.5
  rect.speedR = rect.speedR - (angle - rect.rot)
  }
  
  if (dPress == true && grounded == false){
    rect.speedR -= acc *0.01
  }
  if (aPress == true && grounded == false){
    rect.speedR += acc *0.01
  }
  rect.rot -= rect.speedR * 0.03
  if(rect.rot > Math.PI) rect.rot = -Math.PI
  if(rect.rot < -Math.PI) rect.rot = Math.PI


  
  context.save()
  context.translate(rect.posX, rect.posY)
  context.rotate(rect.rot)
  context.drawImage(img, -rect.width / 2, -rect.height / 2, rect.width, rect.height);
  context.restore()
  
  
}

function clearCanvas() {
  context.drawImage(BackImg,0, 0, canvas.width, canvas.height);
}

let perm = [];
while (perm.length < 255) {
  while (perm.includes((val = Math.floor(Math.random() * 255))));
  perm.push(val);
}
let lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;
let noise = (x) => {
  x = (x * 0.01) % 254;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
};

let t = 0;
function groundLoop() {
  context.fillStyle = "sienna";
  context.beginPath();
  context.moveTo(0, canvas.height);
  for (let i = 0; i < canvas.width; i++)
    context.lineTo(i, canvas.height - noise(t + i) * 0.55);

  context.lineTo(canvas.width, canvas.height);
  context.fill();
}

function scorefunc() {
  context.fillStyle = "black";
  context.font = "30px Arial";
  context.fillText(`Distance: ${Math.round(t / 100)}m`, 50, 50);
}

function update() {
  bikeMovement();
  clearCanvas();
  groundLoop();
  updatePosition(bike);
  requestAnimationFrame(update);
  scorefunc();

  //Kör den här funktionen igen. Det här skapar en "oändlig loop".
}

// requestAnimationFrame(funktion) kör en funktion en gång. Funktionen körs på ett sätt
// som är optimerat för att animera i en webbläsare.
requestAnimationFrame(update);

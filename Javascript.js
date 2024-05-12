let canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const img = new Image();
img.src = "spr_bike2man_0.png";
let context = canvas.getContext("2d");

let bike = {
  width: 80,
  height: 80,
  posX: canvas.width / 2 - 40,
  posY: 200,
  speedY: 0,
};
let acc = 1;
let dPress = false;
let groundDPress = false;
let grounded = false;
let dAcc = 1;

function draw(rect) {
  context.drawImage(img, rect.posX, rect.posY, rect.width, rect.height);
}

document.onkeydown = function (e) {
  const key = e.key;
  switch (key) {
    case "a":
      if (t >= 0) {
        t -= 10;
      } else {
        t += 0;
      }
      break;

    case "d":
      dPress = true;
      groundDPress = true;
      break;
  }
};

document.onkeyup = function (e) {
  const key = e.key;
  switch (key) {
    case "a":
      t -= 0;
      break;

    case "d":
      groundDPress = false;
      if (grounded == false) {
        dPress = true;
        break;
      }
  }
};

function bikeMovement() {
  if (dPress == true) {
    t += acc;
  }
  if (grounded == true && groundDPress == false) {
    dPress = false;
  }

  if (dPress == false) {
    t += acc - 1;
  }

  if (groundDPress == true && grounded == true && acc < 10) {
    acc *= 1.05;
    console.log(acc);
  }
  if (groundDPress == false && grounded == true && acc > 1) {
    acc /= 1.05;
    console.log(acc);
  }
}

//Uppdaterar postionen på en ruta, beror av speedX och speedY
function updatePosition(rect) {
  let PPh = canvas.height - noise(t + (rect.posX + 40)) * 0.55;

  if (PPh - 80 > rect.posY) {
    rect.speedY += 0.2;
  } else {
    rect.speedY -= (rect.posY - (PPh - 80)) / 2;
    rect.posY = PPh - 80;
  }
  if (rect.posY < -80) {
    rect.posY = -79;
    rect.speedY = 0;
  }
  if (rect.posY >= canvas.height) {
    rect.posY = 0;
  }

  rect.posY += rect.speedY;

  if (PPh - 85 <= rect.posY) {
    grounded = true;
  } else {
    grounded = false;
  }
}

// Denna funktion "tömmer" canvasen genom att måla den svart.
function clearCanvas() {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
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
  context.fillStyle = "black";
  context.beginPath();
  context.moveTo(0, canvas.height);
  for (let i = 0; i < canvas.width; i++)
    context.lineTo(i, canvas.height - noise(t + i) * 0.55);

  context.lineTo(canvas.width, canvas.height);
  context.fill();
}

function scorefunc() {
  let score = document.getElementById("myScore");
  context.fillStyle = "black";
  context.fillText(`score: ${t / 10}`, 50, 50);
}

function update() {
  bikeMovement();
  updatePosition(bike);
  clearCanvas();
  groundLoop();
  draw(bike);
  requestAnimationFrame(update);
  scorefunc();

  //Kör den här funktionen igen. Det här skapar en "oändlig loop".
}

// requestAnimationFrame(funktion) kör en funktion en gång. Funktionen körs på ett sätt
// som är optimerat för att animera i en webbläsare.
requestAnimationFrame(update);

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
  rot: 0,
  speedR: 0,
};
let acc = 1;
let drive = false;
let dPress = false;
let grounded = false;

function draw(rect) {
  context.drawImage(img, rect.posX, rect.posY, rect.width, rect.height);
  
}

document.onkeydown = function (e) {
  const key = e.key;
  switch (key) {
    case "a":
      if (t >= 0) {
        t -= 1;
      } else {
        t += 0;
      }
      break;

    case "d":
      drive = true;
      dPress = true;
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
      dPress = false;
      if (grounded == false) {
        drive = true;
        break;
      }
  }
};

function bikeMovement() {
  if (drive == true) {
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
  } //Har inte denna if-sats i if (drive == false sats) eftersom den ger olika physics till den här
}

function updatePosition(rect) {
  let PPh1 = canvas.height - noise(t + rect.posX) * 0.55;
  let PPh2 = canvas.height - noise(t + (rect.posX + 15)) * 0.55;

  let dawg = 0;
  if (PPh1 - 78 > rect.posY) {
    rect.speedY += 0.2;
  } else {
    rect.speedY -= (rect.posY - (PPh1 - 78)) / 2;
    rect.posY = PPh1 - 78;
    dawg = 1;
  }
  if (rect.posY < -80) {
    rect.posY = -79;
    rect.speedY = 0;
  }
  rect.posY += rect.speedY;

  if (PPh1 - 82 <= rect.posY) {
    grounded = true;
  } else {
    grounded = false;
  }

  let angle = Math.atan2((PPh2 - 78) - rect.posY, (rect.posX + 15) - rect.posX);
  console.log(angle)
  rect.rot = angle;
  context.save()
  context.translate(rect.posX, rect.posY)
  context.rotate(rect.rot);
  context.restore()
}

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
  context.fillStyle = "black";
  context.font = "30px Arial";
  context.fillText(`score: ${Math.round(t / 100)}`, 50, 50);
}

function update() {
  bikeMovement();
  clearCanvas();
  groundLoop();
  draw(bike);
  updatePosition(bike);
  requestAnimationFrame(update);
  scorefunc();

  //Kör den här funktionen igen. Det här skapar en "oändlig loop".
}

// requestAnimationFrame(funktion) kör en funktion en gång. Funktionen körs på ett sätt
// som är optimerat för att animera i en webbläsare.
requestAnimationFrame(update);

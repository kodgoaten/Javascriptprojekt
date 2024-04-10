let canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10; // -10 eftersom canvasen blir liiite för stor annars ¯\_(ツ)_/¯

let context = canvas.getContext("2d");

//Ett objekt som håller information om en ruta som ska ritas
let square = {
  color: "red",
  width: 80,
  height: 30,
  posX: 50,
  posY: 50,
  speed: 5,
  speedX: 0, // Egenskaper för att styra hastigheten på rutan
  speedY: 0,
  rotation: 0,
};

document.onkeydown = function (e) {
  console.log(e);
  const key = e.key;
  switch (key) {
    case "w":
      square.rotation -= 5; // Rotate counter-clockwise by reducing rotation angle
      rotateObject(square.rotation);
      break;
    case "a":
      square.speedX = -square.speed;
      break;
    case "s":
      square.speedY = square.speed;
      break;
    case "d":
      square.speedX = square.speed;
      break;
  }
};

document.onkeyup = function (e) {
  console.log(e);
  const key = e.key;
  switch (key) {
    case "Shift":

      break;
    case "w":
      
      break;
    case "a":
      square.speedX = 0;
      break;
    case "s":
      square.speedY = 0;
      break;
    case "d":
      square.speedX = 0;
      break;
  }
};

function rotateObject(degrees) {
  let square = document.getElementById('square');
  square.style.transform = 'rotate(' + degrees + 'deg)';
}
//Ritar ut en ruta med sin färg, på den position den befinner sig.
function drawRect(rect) {
  context.fillStyle = rect.color;
  context.fillRect(rect.posX, rect.posY, rect.width, rect.height);
}

//Uppdaterar postionen på en ruta, beror av speedX och speedY
function updatePosition(rect) {
  // Kontrollera om rutan kolliderar med nedre kanten av canvasen.
  if (rect.posY + rect.height >= canvas.height - 200) {
    // Vänd på hastigheten i y-led
    rect.speedY = 0;
  } else if (rect.posY <= 0) {
    rect.speedY = -rect.speedY;
  }
  if (rect.posX + rect.width >= canvas.width) {
    // Vänd på hastigheten i y-led
    rect.speedX = -rect.speedX;
  } else if (rect.posX <= 0) {
    // Vänd på hastigheten i y-led
    rect.speedX = -rect.speedX;
    rect.speedY = -2;
  }

  rect.posX += rect.speedX;
  rect.posY += rect.speedY;
  //   console.log(rect)
}

// Denna funktion "tömmer" canvasen genom att måla den svart.
function clearCanvas() {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function ground() {
  context.fillStyle = "black";
  context.fillRect(0, canvas.height, canvas.width, -200);
}

// Det här är huvudfunktionen som kör funktioner för att animeringen ska fungera.
function update() {
  updatePosition(square);
  clearCanvas();
  drawRect(square);
  ground();
  requestAnimationFrame(update); //Kör den här funktionen igen. Det här skapar en "oändlig loop".
}

// requestAnimationFrame(funktion) kör en funktion en gång. Funktionen körs på ett sätt
// som är optimerat för att animera i en webbläsare.
requestAnimationFrame(update);

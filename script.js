window.Game = {}
Game.Rectangle = Rectangle
Game.Camera = Camera
Game.Player = Player
Game.Map = Map;

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// game settings:	
var FPS = 30;
var INTERVAL = 1000 / FPS; // milliseconds
var STEP = INTERVAL / 1000 // seconds

// setup an object that represents the room
var room = {
  width: 5000,
  height: 3000,
  map: new Game.Map(5000, 3000)
};

// generate a large image texture for the room
//room.map.generate();
//alternatively we can importImage
room.map.importImage();

// setup player
var player = new Game.Player(50, 50);

// Old camera setup. It not works with maps smaller than canvas. Keeping the code deactivated here as reference.
/* var camera = new Game.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);*/
/* camera.follow(player, canvas.width / 2, canvas.height / 2); */

// Set the right viewport size for the camera
var vWidth = Math.min(room.width, canvas.width);
var vHeight = Math.min(room.height, canvas.height);

// Setup the camera
var camera = new Game.Camera(0, 0, vWidth, vHeight, room.width, room.height);
camera.follow(player, vWidth / 2, vHeight / 2);

// Game update function
var update = function () {
  player.update(STEP, room.width, room.height);
  camera.update();
}

// Game draw function
var draw = function () {
  // clear the entire canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // redraw all objects
  room.map.draw(context, camera.xView, camera.yView);
  player.draw(context, camera.xView, camera.yView);
}

// Game Loop
var gameLoop = function () {
  update();
  draw();
}

// <-- configure play/pause capabilities:

// Using setInterval instead of requestAnimationFrame for better cross browser support,
// but it's easy to change to a requestAnimationFrame polyfill.

var runningId = -1;

Game.play = function () {
  if (runningId == -1) {
    runningId = setInterval(function () {
      gameLoop();
    }, INTERVAL);
    console.log("play");
  }
}

Game.togglePause = function () {
  if (runningId == -1) {
    Game.play();
  } else {
    clearInterval(runningId);
    runningId = -1;
    console.log("paused");
  }
}

// <-- configure Game controls:

Game.controls = {
  left: false,
  up: false,
  right: false,
  down: false,
};

window.addEventListener("keydown", function (e) {
  switch (e.key) {
    case 'ArrowLeft': // left arrow
      Game.controls.left = true;
      break;
    case 'ArrowUp': // up arrow
      Game.controls.up = true;
      break;
    case 'ArrowRight': // right arrow
      Game.controls.right = true;
      break;
    case 'ArrowDown': // down arrow
      Game.controls.down = true;
      break;
  }
}, false);

window.addEventListener("keyup", function (e) {
  console.log(e.key)
  switch (e.key) {
    case 'ArrowLeft': // left arrow
      Game.controls.left = false;
      break;
    case 'ArrowUp': // up arrow
      Game.controls.up = false;
      break;
    case `ArrowRight`: // right arrow
      Game.controls.right = false;
      break;
    case `ArrowDown`: // down arrow
      Game.controls.down = false;
      break;
    case 'p': // key P pauses the game
      Game.togglePause();
      break;
  }
}, false);

// -->

// start the game when page is loaded
window.onload = function () {
  Game.play();
}
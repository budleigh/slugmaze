import Game from './game.js';

var canvas = document.getElementById('canvas');
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext('2d');

const game = new Game(width, height);

let lastTimestamp;
let nextTimestamp;

function gameloop(timestamp) {
  lastTimestamp = nextTimestamp;
  nextTimestamp = timestamp;

  game.update((nextTimestamp - lastTimestamp) / 1000);
  game.draw(ctx);

  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);

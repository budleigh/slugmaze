import str from './other-file.js';
import Input from './input.js';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = 800;
var height = 600;

var x = 30;

function update(dt) {
  x += 3;
}

function draw(ctx) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillRect(x, 20, 30, 30);
}

let lastTimestamp;
let nextTimestamp;

function gameloop(timestamp) {
  lastTimestamp = nextTimestamp;
  nextTimestamp = timestamp;

  update((nextTimestamp - lastTimestamp) / 1000);
  draw(ctx);

  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);

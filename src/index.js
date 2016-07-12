import Game from './game.js';

const canvas = document.getElementById('canvas');
const bg = document.getElementById('bg');
const fg = document.getElementById('fg');

const width = canvas.width = bg.width = fg.width = 500;
const height = canvas.height = bg.height = fg.height = 600;

const ctx = canvas.getContext('2d');
const bgCtx = bg.getContext('2d');
const fgCtx = fg.getContext('2d');

const game = new Game(width, height);

let lastTimestamp;
let nextTimestamp;

function gameloop(timestamp) {
  lastTimestamp = nextTimestamp;
  nextTimestamp = timestamp;

  game.update((nextTimestamp - lastTimestamp) / 1000);
  game.draw(ctx, bgCtx, fgCtx);

  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);

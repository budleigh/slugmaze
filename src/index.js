import str from './other-file.js';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = str;
ctx.fillRect(30, 30, 30, 30);

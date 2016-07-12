import Director from './Director.js';
import Input from './Input.js';
import Background from './Background.js';

class Game {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    this.input = new Input();
    this.director = new Director(w, h, 5);
    this.background = new Background(w, h);
  }

  update(dt) {
    this.input.update();
    this.director.update(dt, this.input.getPressedKeys());
  }

  draw(ctx, bgCtx) {
    // draw background
    this.background.draw(bgCtx);

    // draw game
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    this.director.draw(ctx);

    ctx.strokeRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}

export default Game;

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
    if (!dt) return;

    this.input.update();
    this.background.update(dt);
    this.director.update(dt, this.input.getPressedKeys());
  }

  draw(ctx, bgCtx) {
    this.background.draw(bgCtx);

    // draw front layer
    ctx.save();
    ctx.clearRect(0, 0, this.w, this.h);
    this.director.draw(ctx);
    ctx.restore();
  }
}

export default Game;

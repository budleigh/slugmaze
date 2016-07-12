import TWEEN from 'tween.js';

import Director from './Director.js';
import Input from './Input.js';
import Background from './Background.js';
import GameOver from './GameOver.js';

class Game {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    const cellsPerSide = 4;

    this.input = new Input();
    this.background = new Background(w, h);
    this.foreground = new GameOver(w, h);
    this.director = new Director(
      w,
      h,
      cellsPerSide,
      this.background.getAPI(),
      this.foreground.runGameOver.bind(this.foreground)
    );
  }

  update(dt) {
    if (!dt) return;

    this.input.update();
    this.background.update(dt);
    this.foreground.update(dt);
    this.director.update(dt, this.input.getPressedKeys());
  }

  draw(ctx, bgCtx, fgCtx) {
    this.background.draw(bgCtx);

    // draw game layer
    ctx.save();
    ctx.clearRect(0, 0, this.w, this.h);
    this.director.draw(ctx);
    ctx.restore();

    this.foreground.draw(fgCtx);
  }
}

export default Game;

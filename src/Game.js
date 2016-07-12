import Director from './Director.js';
import Input from './Input.js';

class Game {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    this.input = new Input();

    this.director = new Director();
  }

  update(dt) {
    this.input.update();
    this.director.update(dt, this.input.getPressedKeys());
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.w, this.h);
    this.director.draw(ctx);
  }
}

export default Game;

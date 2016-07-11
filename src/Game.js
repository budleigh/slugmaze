class Game {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.x = 0;
  }

  update(dt) {
    this.x += 3;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillRect(this.x, 30, 20, 20);
  }
}

export default Game

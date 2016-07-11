import Maze from './Maze.js';

class Game {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.x = 0;

    this.maze = new Maze(50, 50, 90, 90, 6);
  }

  update(dt) {

  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.w, this.h);
    this.maze.draw(ctx);
  }
}

export default Game;

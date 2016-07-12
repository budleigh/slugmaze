import Path from './Path.js';
import Maze from './Maze.js';

class Director {
  constructor() {
    this.maze = new Maze(50, 50, 90, 90, 6);
  }

  newRound() {
    const playerGridCoords = this.maze.getPlayerGridCoords();
    const path = Path.random();
  }

  update(dt, keys) {
    this.maze.update(dt, keys);
  }

  draw(ctx) {
    this.maze.draw(ctx);
  }
}

export default Director;

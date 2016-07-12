import Path from './Path.js';
import Maze, { events } from './Maze.js';

class Director {
  constructor() {
    this.cellsPerSide = 6;
    this.maze = new Maze(50, 50, 90, 90, this.cellsPerSide);
    this.newRound();

    this.maze.emitter.on(events.GOAL, () => this.newRound());
  }

  newRound() {
    this.clearPathAtPlayer();
    this.maze.tweenCellAlpha(1000, 0);
  }

  clearPathAtPlayer() {
    // clear off any paths that were already
    this.maze.closeAllPaths();

    const { x: startX, y: startY } = this.maze.getPlayerGridCoords();

    const path = Path.random(
      startX,
      startY,
      this.cellsPerSide,
      this.cellsPerSide,
      6
    );

    const delta = Path.delta(path);

    this.maze.openPath(startX, startY, path);

    this.maze.setGoal({
      x: startX + delta.x,
      y: startY + delta.y,
    });
  }

  update(dt, keys) {
    this.maze.update(dt, keys);
  }

  draw(ctx) {
    this.maze.draw(ctx);
  }
}

export default Director;

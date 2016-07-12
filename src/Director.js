import Entity from './Entity.js';
import Path from './Path.js';
import Maze, { events } from './Maze.js';

class Director extends Entity {
  constructor(w, h, cellsPerSide) {
    super(0, 0, w, h);

    this.cellsPerSide = cellsPerSide;

    this.maze = this.createMaze(w, h, cellsPerSide);
    this.newRound();

    this.maze.emitter.on(events.GOAL, () => this.newRound());
  }

  createMaze(w, h, cellsPerSide) {
    const mazeSideLength = Math.min(w, h) * 1/2;
    const mazeX = (w - mazeSideLength) / 2;
    const mazeY = (h - mazeSideLength) / 2;

    const cellSideLength = mazeSideLength / cellsPerSide;

    return new Maze(mazeX, mazeY, cellSideLength, cellSideLength, cellsPerSide);
  }

  newRound() {
    this.clearPathAtPlayer();
    this.showPaths();
  }

  showPaths() {
    const fadeInDuration = 600;
    const fadeOutDuration = 600;

    this.maze.tweenCellAlpha(fadeInDuration, 1)
      .onComplete(() => {
        this.maze.tweenCellAlpha(fadeOutDuration, 0);
      });
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

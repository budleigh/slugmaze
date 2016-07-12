import { sample } from 'lodash';

import Entity from './Entity.js';
import Path from './Path.js';
import Maze, { events } from './Maze.js';
import HUD from './HUD.js';

class Director extends Entity {
  constructor(w, h, cellsPerSide) {
    super(0, 0, w, h);

    this.cellsPerSide = cellsPerSide;
    this.round = 0;
    this.lives = 3;

    this.maze = this.createMaze(w, h, cellsPerSide);
    this.newRound();

    this.maze.emitter.on(events.GOAL, () => this.newRound());
    this.maze.emitter.on(events.DIE, () => this.killPlayer());
  }

  createMaze(w, h, cellsPerSide) {
    const mazeSideLength = Math.min(w, h) * .66;
    const mazeX = (w - mazeSideLength) / 2;
    const mazeY = (h - mazeSideLength) / 2;

    const cellSideLength = mazeSideLength / cellsPerSide;

    return new Maze(mazeX, mazeY, cellSideLength, cellSideLength, cellsPerSide);
  }

  newRound() {
    this.round += 1;

    this.clearPathAtPlayer();

    this.maze.setPlayerMobility(false);

    this.showPaths(250, () => {
      this.reflectMaze(0, () => {
        this.maze.setPlayerMobility(true)
      });
    });
  }

  killPlayer() {
    this.lives -= 1;
    console.log('you died haha');
  }

  showPaths(delay = 0, callback) {
    const fadeInDuration = 400;
    const fadeOutDuration = 700;

    // yuck
    setTimeout(() => {
      this.maze.tweenCellAlpha(fadeInDuration, 1).onComplete(() => {
        this.maze.tweenCellAlpha(fadeOutDuration, 0).onComplete(callback);
      });
    }, delay)
  }

  rotateMaze(delay = 0, callback) {
    const turns = sample([-2, -1, 1, 2]);
    const duration = Math.abs(600 * turns);

    setTimeout(() => {
      this.maze.tweenRotation(duration, turns).onComplete(() => {
        this.maze.applyInputRotation(turns);
        callback();
      });
    }, delay);
  }

  reflectMaze(delay = 0, callback) {
    const duration = 600;
    const xAxis = Math.random() > .5;

    setTimeout(() => {
      this.maze.tweenReflection(duration, xAxis).onComplete(() => {
        this.maze.applyInputReflection(xAxis);
        callback();
      });
    }, delay);
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

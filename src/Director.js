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

    this.HUD = this.createHUD(w, h);

    this.maze = this.createMaze(w, h, cellsPerSide);
    this.maze.emitter.on(events.GOAL, () => this.newRound());
    this.maze.emitter.on(events.DIE, () => this.killPlayer());

    this.newRound();
  }

  createMaze(w, h, cellsPerSide) {
    const mazeSideLength = Math.min(w, h) * .66;
    const mazeX = (w - mazeSideLength) / 2;
    const mazeY = (h - mazeSideLength) / 2 * 1.15;

    const cellSideLength = mazeSideLength / cellsPerSide;

    return new Maze(mazeX, mazeY, cellSideLength, cellSideLength, cellsPerSide);
  }

  createHUD(w, h) {
    const hudWidth = w * .47;
    const hudHeight = h * .08;
    const hudX = (w - hudWidth) / 2;
    const hudY = h * .05;

    return new HUD(hudX, hudY, hudWidth, hudHeight, 3, 0);
  }

  newRound() {
    this.round += 1;
    this.HUD.setRound(this.round);

    this.maze.setPlayerMobility(false);
    this.clearPathAtPlayer();

    this.showPaths(250, () => {
      this.rotateMaze(100, () => {
        this.maze.setPlayerMobility(true);
      });
    });
  }

  killPlayer() {
    this.lives -= 1;
    this.HUD.removeLife();
  }

  showPaths(delay = 0, onComplete) {
    const fadeInDuration = 400;
    const fadeOutDuration = 700;

    setTimeout(() => {
      this.maze.tweenCellAlpha(fadeInDuration, 1).onComplete(() => {
        this.maze.tweenCellAlpha(fadeOutDuration, 0).onComplete(onComplete);
      });
    }, delay);
  }

  rotateMaze(delay = 0, onComplete) {
    const turns = sample([-2, -1, 1, 2]);
    const duration = Math.abs(600 * turns);

    setTimeout(() => {
      this.maze.tweenRotation(duration, turns).onComplete(() => {
        this.maze.applyInputRotation(turns);
        onComplete();
      });
    }, delay);
  }

  reflectMaze(delay = 0, onComplete) {
    const xAxis = Math.random() > .5;
    const duration = 600;

    setTimeout(() => {
      this.maze.tweenReflection(duration, xAxis).onComplete(() => {
        this.maze.applyInputReflection(xAxis);
        onComplete();
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
    ctx.save();

    this.maze.draw(ctx);
    this.HUD.draw(ctx);
  }
}

export default Director;

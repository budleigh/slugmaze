import { sample, reduceRight } from 'lodash';

import Entity from './Entity.js';
import Path from './Path.js';
import Maze, { events } from './Maze.js';
import HUD from './HUD.js';

const borderColorFlashDuration = 1000;

class Director extends Entity {
  constructor(w, h, cellsPerSide, backgroundAPI) {
    super(0, 0, w, h);
    this.backgroundAPI = backgroundAPI;

    this.round = 0;
    this.lives = 1;

    this.HUD = this.createHUD(w, h);
    this.initMaze(cellsPerSide);

    window.setRound = this.setRound.bind(this);
    window.setLives = this.setLives.bind(this);
    window.initMaze = this.initMaze.bind(this);
  }

  // debug methods to put on `window`
  setRound(round) {
    this.round = round;
    this.HUD.setRound(round);
    this.newRound();
  }

  setLives(lives) {
    this.lives = lives;
    this.HUD.setLives(lives);
  }

  initMaze(cellsPerSide) {
    this.cellsPerSide = cellsPerSide;

    this.maze = this.createMaze(this.w, this.h, cellsPerSide);
    this.maze.emitter.on(events.GOAL, () => this.onGoal());
    this.maze.emitter.on(events.DIE, () => this.onDie());

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

    return new HUD(hudX, hudY, hudWidth, hudHeight, this.lives, this.round);
  }

  onGoal() {
    this.maze.flashBorderColor(borderColorFlashDuration, 'green');

    this.round += 1;
    this.HUD.setRound(this.round);

    this.newRound();
  }

  newRound() {
    this.maze.setPlayerMobility(false);
    this.clearPathAtPlayer();

    this.chainTransforms([
        {
          method: this.showPaths,
          args: [250],
        },
        // {
        //   method: this.rotateMaze,
        //   args: [100],
        // },
        // {
        //   method: this.reflectMaze,
        //   args: [100],
        // },
      ],
      () => this.maze.setPlayerMobility(true)
    );
  }

  // hehe
  chainTransforms(transformData, onComplete) {
    return reduceRight(transformData, (chain, { method, args }) => {
      return method.bind(this, ...args, chain);
    }, onComplete)();
  }

  onDie() {
    this.maze.flashBorderColor(borderColorFlashDuration, 'red');
    this.killPlayer();
    this.newRound();

    this.backgroundAPI.changeCurrent();

    if (this.lives === 0) this.onNoLivesRemaining();
  }

  onNoLivesRemaining() {
    // flash red border forever
    setInterval(() => {
      this.maze.flashBorderColor(borderColorFlashDuration, 'red');
    }, borderColorFlashDuration * 1.2);

    // significantly speed up background
    this.backgroundAPI.setLineSpeed(100);
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
    const pathLength = Math.floor(this.round / 2) + 3;

    const path = Path.random(
      startX,
      startY,
      this.cellsPerSide,
      this.cellsPerSide,
      pathLength
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

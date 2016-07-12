import ee from 'event-emitter';
import { isEqual, mapValues, noop } from 'lodash';
import TWEEN from 'tween.js';

import Entity from './Entity.js';
import Cell from './Cell.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Path from './Path.js';
import Dir from './dirs.js';

const events = {
  GOAL: 0,
  DIE: 1,
};

// use functions here to get clean copies because we're going
// to end up mutating them
const borderRGBAs = {
  neutral: () => ({ r: 255, g: 255, b: 255, a: 0.6 }),
  green: () => ({ r: 0, g: 255, b: 0, a: 0.8 }),
  red: () => ({ r: 255, g: 0, b: 0, a: 0.8 }),
};

class Maze extends Entity {
  constructor(x, y, cellWidth, cellHeight, cellsPerSide) {
    super(x, y, cellWidth * cellsPerSide, cellHeight * cellsPerSide);
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellsPerSide = cellsPerSide;

    this.cells = this.createCells(cellWidth, cellHeight, cellsPerSide);
    this.player = this.createPlayer(1, 2);
    this.playerCanMove = false;

    this.emitter = ee();

    this.transforms = {
      cellAlpha: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      borderRGBA: borderRGBAs.neutral(),
    };

    this.inputTransform = {
      rotation: 0,
      reflectX: false,
      reflectY: false,
    };

    this.goal = {};
  }

  tweenCellAlpha(duration, target) {
    // might as well start it now because it uses the `this.transforms` value
    // it sees on construction, rather than whatever it might be when we call
    // `.start()`. this is really REALLY vile and they should be ashamed
    return new TWEEN.Tween(this.transforms)
      .to({ cellAlpha: target }, duration)
      .start();
  }

  tweenRotation(duration, ccwQuarterTurns) {
    const rotation = this.transforms.rotation + ccwQuarterTurns * Math.PI / 2;

    return new TWEEN.Tween(this.transforms)
      .to({ rotation }, duration)
      .start();
  }

  applyInputRotation(ccwQuarterTurns) {
    // add 16 to avoid ending up with a negative modulus.
    // this is somehow the nicest solution...
    this.inputTransform.rotation += ccwQuarterTurns + 16;
    this.inputTransform.rotation %= 4;
  }

  // second argument is true if reflecting x-axis, false if y-axis.
  // to do both at once you can just call this twice
  tweenReflection(duration, xAxis) {
    const transformProperty = xAxis ? 'scaleX' : 'scaleY';
    const target = this.transforms[transformProperty] * -1;

    return new TWEEN.Tween(this.transforms)
      .to({ [transformProperty]: target }, duration)
      .start();
  }

  applyInputReflection(xAxis) {
    const prop = xAxis ? 'reflectX' : 'reflectY';

    this.inputTransform[prop] = !this.inputTransform[prop];
  }

  tweenBorderRGBA(duration, target) {
    return new TWEEN.Tween(this.transforms.borderRGBA)
      .to(target, duration)
      .start();
  }

  // `color` is read as a property from `borderRGBAs`
  flashBorderColor(duration, color, onComplete = noop) {
    // tween in for 1/4 `duration`
    return this.tweenBorderRGBA(duration / 4, borderRGBAs[color]()).onComplete(() => {
      // delay for 1/2 `duration`
      setTimeout(() => {
        // tween out for 1/4 `duration`
        this.tweenBorderRGBA(duration / 4, borderRGBAs.neutral()).onComplete(onComplete);
      }, duration / 2);
    });
  }

  createCells(cellWidth, cellHeight, cellsPerSide) {
    const result = new Grid(cellsPerSide, cellsPerSide);

    result.writeEach((__, x, y) => {
      return new Cell(
        x * cellWidth,
        y * cellHeight,
        cellWidth,
        cellHeight
      );
    });

    return result;
  }

  createPlayer(gridX, gridY) {
    return new Player(this.cells.read(gridX, gridY), gridX, gridY, 12, 12);
  }

  setPlayerMobility(boolean) {
    this.playerCanMove = boolean;
  }

  getPlayerGridCoords() {
    return this.player.getGridCoords();
  }

  setGoal(goal) {
    this.goal = goal;
  }

  closeAllPaths() {
    this.cells.each(cell => cell.closeAllPaths());
  }

  openPath(startX, startY, path) {
    Path.each(startX, startY, path, (x, y, idx) => {
      const cell = this.cells.read(x, y);

      // in (almost) every cell, we need to open the path we leave from
      // and the path we came from
      const exitDir = path[idx];
      const enterDir = Dir.oppDirs[path[idx - 1]];

      if (exitDir) cell.openPath(exitDir);
      if (enterDir) cell.openPath(enterDir);
    });
  }

  setGoal(goal) {
    this.goal = goal;
  }

  applyInputTransform(dir) {
    const { rotation, reflectX, reflectY } = this.inputTransform;
    let result = dir;

    result = Dir.rotate(result, rotation);
    if (reflectX) result = Dir.reflectX[result];
    if (reflectY) result = Dir.reflectY[result];

    return result;
  }

  handleInput(keys) {
    if(!this.playerCanMove) return;

    // just worry about one key for now
    if (!keys.length) return;
    const dir = this.applyInputTransform(keys[0]);

    if (this.isValidInput(dir)) {
      const gridDelta = Dir.delta[dir];
      const gridX = this.player.gridX + gridDelta.x;
      const gridY = this.player.gridY + gridDelta.y;

      this.player.moveToCell(this.cells.read(gridX, gridY), gridX, gridY);

      if (isEqual(this.player.getGridCoords(), this.goal)) {
        this.emitter.emit(events.GOAL);
      }
    } else {
      // TODO: kill player here
      this.emitter.emit(events.DIE);
    }
  }

  isValidInput(dir) {
    return this.cells
      .read(this.player.gridX, this.player.gridY)
      .hasPath(dir);
  }

  update(dt, keys) {
    TWEEN.update();
    this.handleInput(keys);
  }

  drawBorder(ctx) {
    const { r, g, b } = mapValues(this.transforms.borderRGBA, Math.floor);
    const a = this.transforms.borderRGBA.a;

    // draw border
    ctx.lineWidth = '4';
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.strokeRect(0, 0, this.w, this.h);
  }

  applyGraphicalTransforms(ctx) {
    ctx.translate(this.cx, this.cy);
    ctx.rotate(this.transforms.rotation);
    ctx.scale(this.transforms.scaleX, this.transforms.scaleY);
    ctx.translate(this.x - this.cx, this.y - this.cy);
  }

  draw(ctx) {
    ctx.save();
    this.applyGraphicalTransforms(ctx);

    this.cells.each(cell => cell.draw(ctx, this.transforms.cellAlpha));
    this.drawBorder(ctx);
    this.player.draw(ctx, this.playerCanMove);

    ctx.restore();
  }
}

export default Maze;
export { events };

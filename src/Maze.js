import ee from 'event-emitter';
import { isEqual } from 'lodash';
import TWEEN from 'tween.js';

import Entity from './Entity.js';
import Cell from './Cell.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Path from './Path.js';
import { delta, dirs, oppDirs, rotate } from './dirs.js';

const events = {
  GOAL: 0,
  DIE: 1,
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
    };

    this.inputTransform = {
      rotation: 0,
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
      const enterDir = oppDirs[path[idx - 1]];

      if (exitDir) cell.openPath(exitDir);
      if (enterDir) cell.openPath(enterDir);
    });
  }

  setGoal(goal) {
    this.goal = goal;
  }

  applyInputTransform(dir) {
    let result = dir;

    result = rotate(result, this.inputTransform.rotation);

    return result;
  }

  handleInput(keys) {
    if(!this.playerCanMove) return;

    // just worry about one key for now
    if (!keys.length) return;
    const dir = this.applyInputTransform(keys[0]);

    console.log({ dir })

    if (this.isValidInput(dir)) {
      const gridDelta = delta[dir];
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
    // draw border
    ctx.lineWidth = '4';
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.strokeRect(0, 0, this.w, this.h);
  }

  applyGraphicalTransforms(ctx) {
    ctx.translate(this.cx, this.cy);
    ctx.rotate(this.transforms.rotation);
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

import ee from 'event-emitter';
import { isEqual } from 'lodash';
import TWEEN from 'tween.js';

import Entity from './Entity.js';
import Cell from './Cell.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Path from './Path.js';
import { delta, dirs, oppDirs } from './dirs.js';

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

    this.emitter = ee();

    this.transforms = {
      cellAlpha: 1,
    };

    this.goal = {};
  }

  tweenCellAlpha(duration, target) {
    const tween = new TWEEN.Tween(this.transforms)
      .to({ cellAlpha: target }, duration)
      .start();
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

  handleInput(keys) {
    // just worry about one key for now
    const dir = keys[0];
    if (!dir) return;

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

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    this.cells.each(cell => cell.draw(ctx, this.transforms.cellAlpha));

    ctx.lineWidth = '2';
    ctx.strokeStyle = 'red';
    ctx.strokeRect(0, 0, this.w, this.h);

    this.player.draw(ctx);

    ctx.restore();
  }
}

export default Maze;
export { events };

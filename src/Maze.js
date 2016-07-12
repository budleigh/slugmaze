import Entity from './Entity.js';
import Cell from './Cell.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Path from './Path.js';
import { delta } from './dirs.js';

class Maze extends Entity {
  constructor(x, y, cellWidth, cellHeight, cellsPerSide) {
    super(x, y, cellWidth * cellsPerSide, cellHeight * cellsPerSide);
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellsPerSide = cellsPerSide;
    this.cells = this.createCells(cellWidth, cellHeight, cellsPerSide);

    this.player = this.createPlayer(1, 2);

    const cell = this.cells.read(2, 2);
    cell.openPath('L');
    cell.openPath('D');
    cell.openPath('U');
    cell.openPath('R');
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

  handleInput(keys) {
    // just worry about one key for now
    const key = keys[0];
    if (!key) return;

    const gridDelta = delta[key];
    const gridX = this.player.gridX + gridDelta.x;
    const gridY = this.player.gridY + gridDelta.y;

    this.player.moveToCell(this.cells.read(gridX, gridY), gridX, gridY);
  }

  update(dt, keys) {
    this.handleInput(keys);

    this.cells.each(cell => cell.update(dt));
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    this.cells.each(cell => cell.draw(ctx));

    ctx.lineWidth = '2';
    ctx.strokeStyle = 'red';
    ctx.strokeRect(0, 0, this.w, this.h);

    this.player.draw(ctx);

    ctx.restore();
  }
}

export default Maze;

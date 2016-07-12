import Entity from './Entity.js';
import Cell from './Cell.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Path from './Path.js';
import { delta, dirs, oppDirs } from './dirs.js';

class Maze extends Entity {
  constructor(x, y, cellWidth, cellHeight, cellsPerSide) {
    super(x, y, cellWidth * cellsPerSide, cellHeight * cellsPerSide);
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellsPerSide = cellsPerSide;

    this.cells = this.createCells(cellWidth, cellHeight, cellsPerSide);
    this.player = this.createPlayer(1, 2);

    // testing path drawing
    this.openPath(2, 2, 'DDRRUULUULL');
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

  handleInput(keys) {
    // just worry about one key for now
    const dir = keys[0];
    if (!dir) return;

    if (this.isValidInput(dir)) {
      const gridDelta = delta[dir];
      const gridX = this.player.gridX + gridDelta.x;
      const gridY = this.player.gridY + gridDelta.y;

      this.player.moveToCell(this.cells.read(gridX, gridY), gridX, gridY);
    } else {
      // TODO: kill player here
    }
  }

  isValidInput(dir) {
    return this.cells
      .read(this.player.gridX, this.player.gridY)
      .hasPath(dir);
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

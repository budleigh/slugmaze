import Entity from './Entity.js';
import Cell from './Cell.js';

class Maze extends Entity {
  constructor(x, y, cellWidth, cellHeight, cellsPerSide) {
    super(x, y, cellWidth * cellsPerSide, cellHeight * cellsPerSide);
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellsPerSide = cellsPerSide;
    this.cells = this.createCells(cellWidth, cellHeight, cellsPerSide);
  }

  createCells(cellWidth, cellHeight, cellsPerSide) {
    var result = [];

    for (let i = 0; i < cellsPerSide; i++) {
      result[i] = [];
      for (let j = 0; j < cellsPerSide; j++) {
        result[i][j] = new Cell(
          i * cellWidth,
          j * cellHeight,
          cellWidth,
          cellHeight
        );
      }
    }

    return result;
  }

  forEachCell(callback) {
    for (let i = 0; i < this.cellsPerSide; i++) {
      for (let j = 0; j < this.cellsPerSide; j++) {
        callback(this.cells[i][j], i, j);
      }
    }
  }

  update(dt) {
    this.forEachCell(cell => cell.update(dt));
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    this.forEachCell(cell => cell.draw(ctx));

    ctx.lineWidth = '2';
    ctx.strokeStyle = 'red';
    ctx.strokeRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}

export default Maze;

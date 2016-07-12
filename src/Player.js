import Entity from './Entity.js';

class Player extends Entity {
  constructor(cell, gridX, gridY, w, h) {
    // leave the position at the origin because we'll compute it next
    super(0, 0, w, h);

    this.moveToCell(cell, gridX, gridY);
  }

  moveToCell(cell, gridX, gridY) {
    this.moveTo(cell.cx - this.w / 2, cell.cy - this.h / 2);
    this.gridX = gridX;
    this.gridY = gridY;
  }

  getGridCoords() {
    return {
      x: this.gridX,
      y: this.gridY,
    };
  }

  draw(ctx, canMove) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = canMove ? 'green' : 'red';

    ctx.fillRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}

export default Player;

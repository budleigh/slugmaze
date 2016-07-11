import Entity from './Entity.js';

class Player extends Entity {
  constructor(cell, w, h) {
    super(cell.cx - w / 2, cell.cy - h / 2, w, h);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = 'red';

    ctx.fillRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}

export default Player;

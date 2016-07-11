import Entity from './Entity.js';

class Cell extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = 'black';

    ctx.fillRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}

export default Cell;

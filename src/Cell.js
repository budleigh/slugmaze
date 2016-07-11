import Entity from './Entity.js';

class Cell extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.centerSize = 6;
  }

  drawCenter(ctx) {
    ctx.save();

    ctx.fillStyle = 'rgb(180,180,180)';
    ctx.fillRect(
      -this.centerSize / 2,
      -this.centerSize / 2,
      this.centerSize,
      this.centerSize
    );

    ctx.restore();
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = 'black';

    ctx.fillRect(0, 0, this.w, this.h);


    ctx.restore();

    ctx.save();
    ctx.translate(this.cx, this.cy);
    this.drawCenter(ctx);
    ctx.restore();
  }
}

export default Cell;

import Entity from './Entity.js';

class HUD extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    ctx.strokeRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}

export default HUD;

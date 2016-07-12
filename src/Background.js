import Entity from './Entity';

class Background extends Entity {
  constructor(w, h) {
    super(0, 0, w, h);
    this.lineSpacing = 60;
    this.lineStyle = 'rgba(50,50,50,.7)';

    this.transform = {
      translationNE: 0,
    };

    this.lineSpeed = 25;
  }

  drawNELines(ctx) {
    const translation = this.transform.translationNE;
    let x = 0;

    while (x < this.w * 2) {
      ctx.beginPath();
      ctx.moveTo(x - translation, 0);
      ctx.lineTo(0, x - translation);
      ctx.stroke();

      x += this.lineSpacing;
    }
  }

  drawSELines(ctx) {
    let y = -2 * this.h;

    while (y < this.h) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.h - y, this.h);
      ctx.stroke();

      y += this.lineSpacing;
    }
  }

  update(dt) {
    this.transform.translationNE += dt * this.lineSpeed;
    this.transform.translationNE %= this.lineSpacing;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.lineStyle;

    ctx.fillRect(0, 0, this.w, this.h);

    // both of these are suuuper lazy but I don't really
    // want to think about it
    this.drawNELines(ctx);
    this.drawSELines(ctx);

    ctx.restore();
  }
}

export default Background;

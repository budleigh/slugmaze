import Entity from './Entity';

class Background extends Entity {
  constructor(w, h) {
    super(0, 0, w, h);
    this.lineSpacing = 50;
    this.lineStyle = 'rgba(50,50,50,.7)';

    this.transform = {
      translationNE: 0,
      translationSE: 0,
    };

    // true if the NE lines are moving
    // false if the SE lines are moving
    this.translatingNE = false;

    this.lineSpeed = 50;
  }

  setLineSpeed(speed) {
    this.lineSpeed = speed;
  }

  bumpLineSpeed(ds) {
    this.lineSpeed += ds;
  }

  changeCurrent() {
    // always change the translated line direction
    this.translatingNE = !this.translatingNE;

    // sometimes change which way they're being translated
    if (Math.random() < .5) {
      this.lineSpeed = -this.lineSpeed;
    }
  }

  getAPI() {
    return {
      setLineSpeed: this.setLineSpeed.bind(this),
      bumpLineSpeed: this.bumpLineSpeed.bind(this),
      changeCurrent: this.changeCurrent.bind(this),
    };
  }

  drawNELines(ctx) {
    const translation = this.transform.translationNE;
    let x = 0;

    while (x < this.w * 3) {
      ctx.beginPath();
      ctx.moveTo(x - translation, 0);
      ctx.lineTo(0, x - translation);
      ctx.stroke();

      x += this.lineSpacing;
    }
  }

  drawSELines(ctx) {
    const translation = this.transform.translationSE;
    let y = -2 * this.h;

    while (y < 2 * this.h) {
      ctx.beginPath();
      ctx.moveTo(0 - translation - 100, y);
      ctx.lineTo(this.h - y, this.h + translation + 100);
      ctx.stroke();

      y += this.lineSpacing;
    }
  }

  update(dt) {
    const prop = this.translatingNE ? 'translationNE' : 'translationSE';
    this.transform[prop] += dt * this.lineSpeed;
    this.transform[prop] %= this.lineSpacing;
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

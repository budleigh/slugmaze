import TWEEN from 'tween.js';
import { each, map } from 'lodash';

import Entity from './Entity.js';

const globalCtx = document.getElementById('fg').getContext('2d');

class GameOver extends Entity {
  constructor(w, h) {
    super(0, 0, w, h);

    this.font = '30px sans-serif';
    this.transform = {
      alpha: 0
    };

    this.shouldDrawMessage = false;

    this.message = this.createMessage(globalCtx);
  }

  runGameOver() {
    new TWEEN.Tween(this.transform)
      .to({ alpha: 1 }, 3000)
      .easing(TWEEN.Easing.Cubic.In)
      .start();

    setTimeout(() => {
      this.shouldDrawMessage = true;
    }, 4500);
  }

  update(dt) {
    TWEEN.update();
  }

  createMessage(ctx) {
    ctx.save();
    ctx.font = this.font;

    const message = [
      'you have been',
      'claimed by the',
      'sleepy beyond',
    ];

    const measures = map(message, ctx.measureText.bind(ctx));

    ctx.restore();

    const spacingY = 30;
    const offsetY = this.h / 2 - spacingY * Math.floor(message.length / 2);

    return map(measures, (measure, idx) => {
      return {
        x: Math.floor((this.w - measure.width) / 2),
        y: offsetY + idx * spacingY,
        string: message[idx],
      };
    });

  }

  drawMessage(ctx) {
    ctx.save();
    ctx.font = this.font;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';

    each(this.message, ({ string, x, y }) => {
      ctx.fillText(string, x, y);
    });
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.w, this.h);

    const { alpha } = this.transform;

    if (!alpha) return;

    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;

    ctx.fillRect(0, 0, this.w, this.h);

    if (this.shouldDrawMessage) {
      this.drawMessage(ctx);
    }

    ctx.restore();
  }
}

export default GameOver;

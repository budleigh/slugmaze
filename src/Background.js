import TWEEN from 'tween.js';

import Entity from './Entity';

class Background extends Entity {
  constructor(w, h) {
    super(0, 0, w, h);
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';

    ctx.fillRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}

export default Background;

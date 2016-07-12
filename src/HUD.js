import { range, each, map } from 'lodash';

import Entity from './Entity.js';
import Player from './Player.js';

class HUD extends Entity {
  constructor(x, y, w, h, lives, round) {
    super(x, y, w, h);
    this.lives = lives;
    this.round = round;
    this.playerClones = this.createPlayerClones(lives);
    console.log(this.playerClones)
  }

  createPlayerClones(lives) {
    const playerSideLength = 18;
    const spacing = playerSideLength * 2;
    const leftPad = playerSideLength;
    const topPad = (this.h - playerSideLength) / 2;

    return map(
      range(lives),
      life => new Entity(
        life * spacing + leftPad,
        topPad,
        playerSideLength,
        playerSideLength
      )
    );
  }

  drawPlayerClones(ctx) {
    each(this.playerClones, (clone) => {
      Player.prototype.draw.call(clone, ctx, true);
    });
  }

  drawBorder(ctx) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    ctx.strokeRect(0, 0, this.w, this.h);

    ctx.restore();
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    this.drawBorder(ctx);
    this.drawPlayerClones(ctx);

    ctx.restore();
  }
}

export default HUD;

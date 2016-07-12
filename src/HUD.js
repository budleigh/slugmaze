import { range, each, map } from 'lodash';

import Entity from './Entity.js';
import Player from './Player.js';

class HUD extends Entity {
  constructor(x, y, w, h, lives, round) {
    super(x, y, w, h);
    this.setLives(lives);
    this.setRound(round);
  }

  createPlayerClones(lives) {
    // take up half the horizontal space
    const playerSideLength = this.w / 4 / lives;
    const spacing = playerSideLength * 2;
    const leftPad = playerSideLength / 2;

    // and half the vertical space
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

  setLives(lives) {
    this.playerClones = this.createPlayerClones(lives);
  }

  removeLife() {
    this.playerClones.pop();
  }

  setRound(round) {
    this.round = round;
  }

  drawLives(ctx) {
    each(this.playerClones, (clone) => {
      Player.prototype.draw.call(clone, ctx, true);
    });
  }

  drawRound(ctx) {
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.font = '20px Helvetica';

    ctx.fillText(this.round, this.w * 3 / 4, this.h / 2);

    ctx.restore();
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

    // this.drawBorder(ctx);
    this.drawLives(ctx);
    this.drawRound(ctx);

    ctx.restore();
  }
}

export default HUD;

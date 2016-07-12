import { each, filter } from 'lodash';

import Entity from './Entity.js';
import { dirs, delta } from './dirs.js';

class Cell extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);

    this.centerSize = 8;
    this.pathThickness = 4;
    this.pathOffsetFromCenter = 5;

    this.paths = {};
  }

  // if no `dir` is given, checks whether any path is open at all
  hasPath(dir) {
    return dir ? !!this.paths[dir] : !!filter(this.paths).length;
  }

  openPath(dir) {
    this.paths[dir] = true;
  }

  closeAllPaths() {
    this.paths = {};
  }

  drawPath(ctx, dir) {
    ctx.beginPath();

    const dx = delta[dir].x;
    const dy = delta[dir].y;

    ctx.moveTo(
      this.cx + dx * this.pathOffsetFromCenter,
      this.cy + dy * this.pathOffsetFromCenter
    );

    ctx.lineTo(
      this.cx + dx * this.w / 2,
      this.cy + dy * this.h / 2
    );

    ctx.stroke();
  }

  drawPaths(ctx, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = this.pathThickness;

    each(this.paths, (hasPath, dir) => {
      if (hasPath) {
        this.drawPath(ctx, dir);
      }
    });

    ctx.restore();
  }

  drawCenter(ctx,alpha) {
    ctx.save();
    ctx.translate(this.cx, this.cy);
    ctx.fillStyle = `rgba(180,180,180,${alpha})`;

    ctx.fillRect(
      -this.centerSize / 2,
      -this.centerSize / 2,
      this.centerSize,
      this.centerSize
    );

    ctx.restore();
  }

  drawBackground(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.restore();
  }

  draw(ctx, alpha) {
    this.drawBackground(ctx);

    if (this.hasPath()) {
      this.drawCenter(ctx, alpha);
      this.drawPaths(ctx, alpha);
    }
  }
}

export default Cell;

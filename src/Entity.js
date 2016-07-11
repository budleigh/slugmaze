class Entity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.computeCenter();
  }

  computeCenter() {
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.computeCenter();
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.computeCenter();
  }

  // empty placeholder methods so we don't have to
  // worry about them being undefined
  update(dt) {}
  draw(ctx) {}
}

export default Entity;

class Entity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  // empty placeholder methods so we don't have to
  // worry about them being undefined
  update(dt) {}
  draw(ctx) {}
}

export default Entity;

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Array(w * h);
  }

  coordIdx(x, y) {
    return x * this.h + y;
  }

  read(x, y) {
    return this.data[this.coordIdx(x, y)];
  }

  write(x, y, val) {
    this.data[this.coordIdx(x, y)] = val;
  }

  each(iterator) {
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        iterator(this.read(x, y), x, y);
      }
    }
  }

  writeEach(iterator) {
    this.each((val, x, y) => this.write(x, y, iterator(val, x, y)));
  }
}

export default Grid;

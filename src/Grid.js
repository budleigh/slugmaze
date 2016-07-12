class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Array(w * h);
  }

  isValidIdx(x, y) {
    // block invalid read/writes that are off the grid
    return 0 <= x && x < this.w && 0 <= y && y < this.h;
  }

  coordIdx(x, y) {
    return this.isValidIdx(x, y) ? x * this.h + y : -1;
  }

  read(x, y) {
    return this.data[this.coordIdx(x, y)];
  }

  write(x, y, val) {
    const idx = this.coordIdx(x, y);

    if (idx !== -1) {
      this.data[this.coordIdx(x, y)] = val;
    }
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

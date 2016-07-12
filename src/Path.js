import { filter, sample, each } from 'lodash';

import Dir from './dirs.js';
import Grid from './Grid.js';

class Path {
  // generates a random path of a given length with given start coordinates and
  // given grid boundaries (the mins are implicitly 0).
  static random(startX, startY, maxX, maxY, length) {
    // grid.read(x, y) is true if that cell is unvisited by our path
    const grid = new Grid(maxX, maxY);
    let tries = 0;
    let validDirs;
    let bestPath = '';
    let nextPath;
    let nextDir;
    let x;
    let y;

    while (tries < 10) {
      grid.writeEach(() => true);
      nextPath = '';
      x = startX;
      y = startY;

      while (nextPath.length < length) {
        // mark the current cell as visited
        grid.write(x, y, false);

        // enumerate the valid directions from our current location
        validDirs = filter(
          Dir.dirs,
          dir => grid.read(x + Dir.delta[dir].x, y + Dir.delta[dir].y)
        );

        if (validDirs.length) {
          // choose a valid direction, add it to our path, and keep going
          nextDir = sample(validDirs);
          nextPath += nextDir;
          x += Dir.delta[nextDir].x;
          y += Dir.delta[nextDir].y;
        } else {
          // we're stuck! check if our path is an improvement
          bestPath = bestPath.length >= nextPath.length ? bestPath : nextPath;
          // and try again with a new path
          break;
        }
      }

      if (nextPath.length === length) return nextPath;

      tries++;
    }

    // we tried so hard and got so far
    // but in the end it doesn't even matter
    return bestPath;
  }

  // iterates over the path given start coordinates, passing in the
  // current cell coordinate and cell index to the given iterator
  static each(startX, startY, path, iterator) {
    let x = startX;
    let y = startY;

    // calls `iterator` on every cell visited but the last
    each(path, (dir, idx) => {
      iterator(x, y, idx);
      x += Dir.delta[dir].x;
      y += Dir.delta[dir].y;
    });

    // so we need to hit it manually at the end
    iterator(x, y, path.length);
  }

  // computes the change in grid coordinates from the start
  // to the end of the given path
  static delta(path) {
    let result;

    // this is reeeeeeeeeeally stupid but i'll take it
    Path.each(0, 0, path, (x, y, idx) => {
      if (idx === path.length) result = { x, y };
    });

    return result;
  }
}

export default Path;

import { filter, sample } from 'lodash';

import { dirs, delta } from './dirs.js';
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
          dirs,
          dir => grid.read(x + delta[dir].x, y + delta[dir].y)
        );

        console.log({ x, y, validDirs })

        if (validDirs.length) {
          // choose a valid direction, add it to our path, and keep going
          nextDir = sample(validDirs);
          nextPath += nextDir;
          x += delta[nextDir].x;
          y += delta[nextDir].y;
        } else {
          // we're stuck! check if our path is an improvement
          bestPath = bestPath.length >= nextPath.length ? bestPath : nextPath;
          // and try again
          break;
        }
      }

      if (nextPath.length === length) return nextPath;

      tries++;
    }
  }
}

console.log(Path.random(0, 0, 6, 6, 12))

export default Path;

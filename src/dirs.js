import { mapKeys } from 'lodash';

const dirs = mapKeys([
  'L',
  'D',
  'R',
  'U',
], v => v);

const orderedDirs = [dirs.L, dirs.D, dirs.R, dirs.U];

const oppDirs = {
  L: 'R',
  R: 'L',
  U: 'D',
  D: 'U',
};

const delta = {
  L: { x: -1, y: 0 },
  U: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: 1 },
};

const reflectX = {
  L: dirs.R,
  R: dirs.L,
  U: dirs.U,
  D: dirs.D,
};

const reflectY = {
  L: dirs.L,
  R: dirs.R,
  U: dirs.D,
  D: dirs.U,
};

function rotate(dir, turns) {
  const index = orderedDirs.indexOf(dir);
  const resultIndex = (((index + turns) % 4) + 4) % 4;

  return orderedDirs[resultIndex];
}

const Dir = {
  dirs,
  oppDirs,
  delta,
  rotate,
  reflectX,
  reflectY,
};

export default Dir;

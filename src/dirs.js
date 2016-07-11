import { mapKeys } from 'lodash';

const dirs = mapKeys([
  'L',
  'D',
  'R',
  'U',
], v => v);

const delta = {
  L: { x: -1, y: 0 },
  U: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: 1 },
};

export {
  dir,
  delta,
};

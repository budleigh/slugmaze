import { each, filter } from 'lodash';

class Input {
  constructor() {
    this.keymap = {
      37: 'L',
      38: 'U',
      39: 'R',
      40: 'D',
    };

    this.lastFrameInput = {};
    this.currentFrameInput = {};
    this.instantaneousInput = {};

    this.addDocumentListeners();
  }

  addDocumentListeners() {
    document.onkeydown = (e) => {
      const key = this.keymap[e.keyCode];

      if (key) {
        this.instantaneousInput[key] = true;
        e.preventDefault();
      }
    };

    document.onkeyup = (e) => {
      const key = this.keymap[e.keyCode];

      if (key) {
        this.instantaneousInput[key] = false;
        e.preventDefault();
      }
    };
  }

  isPressed(key) {
    return this.currentFrameInput[key] && !this.lastFrameInput[key];
  }

  getPressedKeys() {
    return filter(this.keymap, key => this.isPressed(key));
  }

  update() {
    each(this.keymap, (key) => {
      this.lastFrameInput[key] = this.currentFrameInput[key];
      this.currentFrameInput[key] = this.instantaneousInput[key];
    });
  }
}

export default Input;

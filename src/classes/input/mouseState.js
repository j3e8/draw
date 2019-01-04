/*** Singleton class to store the state of the mouse ***/

class MouseState {
  constructor () {
    this.buttonDown = false;
    this.mouseLocation = null;
    this.isDragging = false;
    this.touches = [];
  }

  mouseDown (pt) {
    this.buttonDown = true;
    this.mouseLocation = pt;
  }

  mouseMove (pt) {
    if (this.buttonDown) {
      this.isDragging = true;
    }
    this.mouseLocation = pt;
  }

  mouseUp (pt) {
    this.buttonDown = false;
    this.isDragging = false;
    this.mouseLocation = pt;
  }
}

module.exports = new MouseState();

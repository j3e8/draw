import Point from './point';
import Size from './size';

class Area {
  static fromPoints (a, b) {
    console.log(a, b);
    return new Area(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.abs(a.x - b.x),
      Math.abs(a.y - b.y),
    );
  }

  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.top = y;
    this.left = x;
    this.bottom = y + h;
    this.right = x + w;
    this.location = new Point(x, y);
    this.size = new Size(w, h);
  }

  containsPoint (pt) {
    if (pt.x >= this.left && pt.x <= this.right && pt.y >= this.top && pt.y <= this.bottom) {
      return true;
    }
    return false;
  }

  getCenter () {
    return new Point((this.left + this.right) / 2, (this.top + this.bottom) / 2);
  }
}

module.exports = Area;

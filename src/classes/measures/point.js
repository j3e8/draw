class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  relativeToArea (area) {
    return new Point(this.x - area.left, this.y - area.top);
  }


}

module.exports = Point;

class Size {
  static fromPoints (a, b) {
    return new Size(
      Math.abs(a.x - b.x),
      Math.abs(a.y - b.y),
    );
  }

  constructor (w, h) {
    this.width = w;
    this.height = h;
  }
}

module.exports = Size;

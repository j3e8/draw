class Color {
  constructor (r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toString () {
    const r = Math.floor(this.r);
    const g = Math.floor(this.g);
    const b = Math.floor(this.b);
    return this.a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${this.a})`;
  }
}

module.exports = Color;

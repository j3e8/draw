const Shape = require('./shape');

class Rectangle extends Shape {
  constructor(location, size, attributes = {}) {
    super(attributes);
    this.location = location;
    this.size = size;
  }

  setLocation (location) {
    this.location = location;
  }

  setSize (size) {
    this.size = size;
  }

  render (ctx) {
    if (!this.fill && !this.stroke) {
      return;
    }
    ctx.fillStyle = this.fill.toString();
    ctx.strokeStyle = this.stroke.toString();
    ctx.lineWidth = this.strokeWidth;
    ctx.beginPath();
    ctx.rect(this.location.x, this.location.y, this.size.width, this.size.height);
    if (this.fill) {
      ctx.fill();
    }
    if (this.stroke) {
      ctx.stroke();
    }
  }
}

module.exports = Rectangle;

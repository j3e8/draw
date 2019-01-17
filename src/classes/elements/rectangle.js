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
    ctx.fillStyle = this.fillColor.toString();
    ctx.strokeStyle = this.strokeColor.toString();
    ctx.lineWidth = this.strokeWidth;
    ctx.beginPath();
    ctx.rect(this.location.x, this.location.y, this.size.width, this.size.height);
    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor && !this.stroke) {
      ctx.stroke();
    }

    this.stroke.render(ctx, this);
  }
}

module.exports = Rectangle;

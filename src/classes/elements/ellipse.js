const Shape = require('./shape');

class Ellipse extends Shape {
  constructor(location, size, attributes = {}) {
    super(attributes);
    this.location = location;
    this.size = size;
  }

  getTotalLineLength () {
    // Ramanujan's approximation
    const h = ((this.size.width - this.size.height) * (this.size.width - this.size.height)) / ((this.size.width + this.size.height) * (this.size.width + this.size.height));
    return Math.PI * (this.size.width + this.size.height) * (1 + ( (3 * h) / (10 + Math.sqrt(4 - 3 * h)) ));
  }

  locationAtStrokePosition (pct) {

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
    ctx.ellipse(this.location.x + this.size.width / 2,
                this.location.y + this.size.height / 2,
                this.size.width / 2,
                this.size.height / 2,
                0,
                0,
                Math.PI * 2);
    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor && !this.stroke) {
      ctx.stroke();
    }
  }
}

module.exports = Ellipse;

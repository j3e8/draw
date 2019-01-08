const Shape = require('./shape');

class Rectangle extends Shape {
  constructor(location, size, attributes = {}) {
    super(attributes);
    this.location = location;
    this.size = size;
    this.calculateLineLength();
  }

  calculateLineLength () {
    this.lineLength = this.size.width * 2 + this.size.height * 2;
  }

  getTotalLineLength () {
    if (!this.lineLength) {
      this.calculateLineLength();
    }
    return this.lineLength;
  }

  locationAtStrokePosition (pct) {
    // start at top left
    const total = this.getTotalLineLength();
    const w = this.size.width / total;
    const h = this.size.height / total;

    if (pct <= w) {
      return {
        x: this.location.x + pct / w * this.size.width,
        y: this.location.y,
      };
    } else if (pct <= w + h) {
      return {
        x: this.location.x + this.size.width,
        y: this.location.y + (pct - w) / h * this.size.height,
      };
    } else if (pct <= w + h + w) {
      return {
        x: this.location.x + this.size.width - (pct - h - w) / w * this.size.width,
        y: this.location.y + this.size.height,
      };
    } else {
      return {
        x: this.location.x,
        y: this.location.y + this.size.height - ((pct - w - h - w) / h * this.size.height),
      };
    }
    return this.location;
  }

  setLocation (location) {
    this.location = location;
  }

  setSize (size) {
    this.size = size;
    this.calculateLineLength();
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

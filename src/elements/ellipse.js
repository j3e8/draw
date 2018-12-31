const SystemColors = require('../color/systemColors');
const Shape = require('./shape');

class Ellipse extends Shape {
  constructor(location, size, attributes = {}) {
    super();
    this.location = location;
    this.size = size;
    this.fill = attributes.fill !== undefined ? attributes.fill : SystemColors.DEFAULT_FILL.toString();
    this.stroke = attributes.stroke !== undefined ? attributes.stroke : SystemColors.DEFAULT_STROKE.toString();
    this.strokeWidth = attributes.strokeWidth !== undefined ? attributes.strokeWidth : null;
  }

  render (ctx) {
    console.log('render oval', this.location, this.size, this.fill.toString());

    if (!this.fill && !this.stroke) {
      return;
    }
    ctx.fillStyle = this.fill.toString();
    ctx.strokeStyle = this.stroke.toString();
    ctx.lineWidth = this.strokeWidth;
    console.log(this.strokeWidth);
    ctx.beginPath();
    ctx.beginPath();
    ctx.ellipse(this.location.x + this.size.width / 2,
                this.location.y + this.size.height / 2,
                this.size.width / 2,
                this.size.height / 2,
                0,
                0,
                Math.PI * 2);
    if (this.fill) {
      ctx.fill();
    }
    if (this.stroke) {
      ctx.stroke();
    }
  }
}

module.exports = Ellipse;

const Shape = require('./shape');
const Path = require('../geometry/path');

class PathElement extends Shape {
  constructor(firstVertex, attributes = {}) {
    super(attributes);
    this.path = new Path(firstVertex);
    this.lineLength = 0;
  }

  addVertex (v) {
    if (this.path) {
      this.path.addVertex(v);
    }
  }

  closePath () {
    if (this.path) {
      this.path.closePath();
    }
  }

  getPath () {
    return this.path;
  }

  render (ctx) {
    ctx.fillStyle = this.fillColor.toString();
    ctx.strokeStyle = this.strokeColor.toString();
    ctx.lineWidth = this.strokeWidth;

    this.path.render(ctx);

    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor && !this.stroke) {
      ctx.stroke();
    } else if (this.stroke) {
      this.stroke.render(ctx, this);
    }
  }
}

module.exports = PathElement;

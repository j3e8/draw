const Shape = require('./shape');
const Path = require('../geometry/path');

const calculatePathBounds = require('../geometry/functions/calculatePathBounds');

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

  render (ctx, scale) {
    console.log('scale', scale);
    const b = calculatePathBounds(this.path);
    console.log(`raster size ${b.width/scale} x ${b.height/scale}`);

    ctx.fillStyle = this.fillColor.toString();
    ctx.strokeStyle = this.strokeColor.toString();
    ctx.lineWidth = this.strokeWidth;

    this.path.render(ctx);

    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor && !this.stroke.length) {
      ctx.stroke();
    } else if (this.stroke.length) {
      this.stroke.forEach(stroke => stroke.render(ctx, this));
    }
  }
}

module.exports = PathElement;

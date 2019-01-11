const Shape = require('./shape');
const Path = require('../geometry/path');
const calculatePathLength = require('../geometry/functions/calculatePathLength');
const locationAtPositionOnPath = require('../geometry/functions/locationAtPositionOnPath');

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

  getTotalLineLength () {
    if (!this.lineLength) {
      this.lineLength = calculatePathLength(this.path);
    }
    return this.lineLength;
  }

  locationAtStrokePosition (pct) {
    return locationAtPositionOnPath(this.path, pct);
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

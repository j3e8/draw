const Segment = require('./segment');
const calculateSegmentLength = require('./functions/calculateSegmentLength');

class Path {
  constructor (firstVertex) {
    this.firstVertex = firstVertex || null;
    this.isClosed = false;
    this.pathLength = null;
  }

  addVertex (v) {
    let vert = this.firstVertex;
    while (vert.nextVertex) {
      vert = vert.nextVertex;
    }
    vert.nextVertex = v;
    v.prevVertex = vert;
    this.pathLength = null;
  }

  getFirstVertex () {
    return this.firstVertex;
  }

  calculatePathLength () {
    // check if it's cached already
    // if (this.pathLength !== null) {
    //   return this.pathLength;
    // }
    let sum = 0;
    let vert = this.firstVertex;
    while (vert.nextVertex) {
      sum += calculateSegmentLength(new Segment(vert, vert.nextVertex));
      vert = vert.nextVertex;
    }

    if (this.isClosed) {
      sum += calculateSegmentLength(new Segment(vert, this.firstVertex));
    }

    this.pathLength = sum;
    return sum;
  }

  closePath () {
    this.isClosed = true;
    this.pathLength = null;
  }

  render (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.firstVertex.location.x, this.firstVertex.location.y);

    let vert = this.firstVertex;
    while (vert && vert.nextVertex) {
      if (vert.controlAfter && vert.nextVertex.controlBefore) {
        // bezier
        ctx.bezierCurveTo(vert.controlAfter.location.x,
                          vert.controlAfter.location.y,
                          vert.nextVertex.controlBefore.location.x,
                          vert.nextVertex.controlBefore.location.y,
                          vert.nextVertex.location.x,
                          vert.nextVertex.location.y,
                        );
      } else {
        // straight line
        ctx.lineTo(vert.nextVertex.location.x, vert.nextVertex.location.y);
      }
      vert = vert.nextVertex;
    }

    if (this.isClosed) {
      ctx.closePath();
    }
  }
}

module.exports = Path;

class Path {
  constructor (firstVertex) {
    this.firstVertex = firstVertex || null;
    this.isClosed = false;
  }

  addVertex (v) {
    let vert = this.firstVertex;
    while (vert.nextVertex) {
      vert = vert.nextVertex;
    }
    vert.nextVertex = v;
    v.prevVertex = vert;
  }

  getFirstVertex () {
    return this.firstVertex;
  }

  closePath () {
    this.isClosed = true;
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

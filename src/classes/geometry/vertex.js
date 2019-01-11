class Vertex {
  constructor (location, controlBefore, controlAfter) {
    this.location = location;
    this.controlBefore = controlBefore;
    this.controlAfter = controlAfter;

    this.prevVertex = null;
    this.nextVertex = null;
  }

  remove () {
    if (this.prevVertex) {
      this.prevVertex.nextVertex = this.nextVertex;
    }
    if (this.nextVertex) {
      this.nextVertex.prevVertex = this.prevVertex;
    }
    this.nextVertex = null;
    this.prevVertex = null;
  }
}

module.exports = Vertex;

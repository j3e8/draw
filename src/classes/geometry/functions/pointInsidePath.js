const Segment = require('../segment');
const Vertex = require('../vertex');
const calculatePathBounds = require('./calculatePathBounds');
const segmentsIntersect = require('./segmentsIntersect');

module.exports = function pointInsidePath (pt, path) {
  const area = calculatePathBounds(path);
  const outsidePoint = {
    x: area.right + 1,
    y: area.bottom + 1,
  }
  const firstVertex = path.getFirstVertex();

  let numberOfCrosses = 0;
  let vert = firstVertex;
  while (vert) {
    const controlSegment = new Segment(new Vertex(pt), new Vertex(outsidePoint));
    const pathSegment = new Segment(vert, vert.nextVertex || firstVertex);
    const intersection = segmentsIntersect(controlSegment, pathSegment);
    if (intersection) {
      numberOfCrosses++;
    }
    vert = vert.nextVertex;
  }

  if (numberOfCrosses % 2 === 0) {
    return false;
  }
  return true;
}

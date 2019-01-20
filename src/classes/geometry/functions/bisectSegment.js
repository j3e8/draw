const Segment = require('../segment');
const Vertex = require('../vertex');
const averagePoints = require('./averagePoints');

module.exports = function bisectSegment (segment, position = 0.5) {
  if (segment.startVertex.controlAfter || segment.endVertex.controlBefore) {
    return bisectBezier(segment, position);
  } else {
    return bisectLinear(segment, position);
  }
}

function bisectBezier (segment, position) {
  const P1 = segment.startVertex.controlAfter || segment.startVertex.location;
  const P2 = segment.endVertex.controlBefore || segment.endVertex.location;
  const Q1 = averagePoints(P1, 1 - position, P2, position);
  const Q0 = averagePoints(segment.startVertex.location, 1 - position, P1, position);
  const Q2 = averagePoints(P2, 1 - position, segment.endVertex.location, position);
  const R0 = averagePoints(Q0, 1 - position, Q1, position);
  const R1 = averagePoints(Q1, 1 - position, Q2, position);
  const B = averagePoints(R0, 1 - position, R1, position);

  const mid = new Vertex(B, R0, R1);

  return [
    new Segment(new Vertex(segment.startVertex.location, segment.startVertex.controlBefore, Q0), mid),
    new Segment(mid, new Vertex(segment.endVertex.location, Q2, segment.endVertex.controlAfter)),
  ];
}

function bisectLinear (segment, position) {
  const midpoint = averagePoints(segment.v1.location, 1 - position, segment.v2.location, position);
  const mid = new Vertex(midpoint);
  return [
    new Segment(segment.v1, mid),
    new Segment(mid, segment.v2),
  ];
}

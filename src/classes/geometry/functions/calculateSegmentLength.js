const distanceBetweenPoints = require('./distanceBetweenPoints');

module.exports = function calculateSegmentLength (segment) {
  const v1 = segment.startVertex;
  const v2 = segment.endVertex;
  if (v1.controlAfter && v2.controlBefore) {
    // bezier
  } else if (v1.controlAfter) {
    // quadratic
  } else if (v2.controlBefore) {
    // quadratic
  } else {
    // straight line
    return distanceBetweenPoints(v1.location, v2.location);
  }
}

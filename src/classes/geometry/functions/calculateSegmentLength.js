const distanceBetweenPoints = require('./distanceBetweenPoints');
const bisectSegment = require('./bisectSegment');

const INSIGNIFICANT_THRESHOLD = 0.001;

module.exports = function calculateSegmentLength (segment) {
  const v1 = segment.startVertex;
  const v2 = segment.endVertex;

  const straightDistance = distanceBetweenPoints(v1.location, v2.location);
  if (straightDistance <= INSIGNIFICANT_THRESHOLD) {
    return straightDistance;
  }

  if (v1.controlAfter || v2.controlBefore) {
    // curve of some kind
    const children = bisectSegment(segment);
    const lengths = children.map(c => calculateSegmentLength(c));
    return lengths[0] + lengths[1];
  } else {
    // straight line
    return straightDistance;
  }
}

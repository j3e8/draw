const calculateSegmentLength = require('./calculateSegmentLength');
const angleBetweenPoints = require('./angleBetweenPoints');
const bisectSegment = require('./bisectSegment');

module.exports = function dataAlongSegment (distance, segment) {
  const v1 = segment.startVertex;
  const v2 = segment.endVertex;

  if (distance === 0) { // edge case
    const angleAfter = angleBetweenPoints(v1.location, v2.location);
    const angleBefore = v1.prevVertex ? angleBetweenPoints(v1.prevVertex.location, v1.location) : angleAfter;
    return {
      angle: (angleBefore + angleAfter) / 2,
      location: v1.location,
    }
  } else if (distance === 1) { // edge case
    const angleBefore = angleBetweenPoints(v1.location, v2.location);
    const angleAfter = v2.nextVertex ? angleBetweenPoints(v2.location, v2.nextVertex.location) : angleBefore;
    return {
      angle: (angleBefore + angleAfter) / 2,
      location: v2.location,
    }
  }

  const totalLength = calculateSegmentLength(segment);
  const pct = distance / totalLength;

  if (v1.controlAfter || v2.controlBefore) {
    const subsegments = bisectSegment(segment, pct);
    const midVertex = subsegments[0].endVertex;
    return {
      angle: angleBetweenPoints(midVertex.controlBefore || midVertex.location, midVertex.controlAfter || midVertex.location),
      location: midVertex.location,
    }
  } else {
    return {
      angle: angleBetweenPoints(v1.location, v2.location),
      location: {
        x: v1.location.x + (v2.location.x - v1.location.x) * pct,
        y: v1.location.y + (v2.location.y - v1.location.y) * pct,
      },
    }
  }
}

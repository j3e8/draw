const calculateSegmentLength = require('./calculateSegmentLength');

module.exports = function locationAlongSegment (distance, v1, v2) {
  if (distance === 0) { // edge case
    return v1.location;
  }

  const totalLength = calculateSegmentLength(v1, v2);

  if (distance === totalLength) { // edge case
    return v2.location;
  }

  if (v1.controlAfter && v2.controlBefore) {
    // bezier
  } else if (v1.controlAfter) {
    // quadratic
  } else if (v2.controlBefore) {
    // quadratic
  } else {
    const pct = distance / totalLength;
    return {
      x: v1.location.x + (v2.location.x - v1.location.x) * pct,
      y: v1.location.y + (v2.location.y - v1.location.y) * pct,
    }
  }
}

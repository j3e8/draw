const Point = require('../point');

module.exports = function segmentsIntersect(a, b) {
  // TODO: handle curves
  const aSlope = (a.endVertex.location.y - a.startVertex.location.y) / (a.endVertex.location.x - a.startVertex.location.x);
  const aIntercept = a.endVertex.location.y - aSlope * a.endVertex.location.x;
  const bSlope = (b.endVertex.location.y - b.startVertex.location.y) / (b.endVertex.location.x - b.startVertex.location.x);
  const bIntercept = b.endVertex.location.y - bSlope * b.endVertex.location.x;

  if (aSlope === bSlope) { // edge case would cause divide by zero
    return a.startVertex.location.x === b.startVertex.location.x ? a.startVertex.location : null; // if they're the same line, return the startVertex.location, otherwise null
  }

  if (aSlope === Infinity) { // vertical first line only
    return new Point(a.startVertex.location.x, bSlope * a.startVertex.location.x + bIntercept);
  } else if (bSlope === Infinity) { // vertical second line
    return new Point(b.startVertex.location.x, aSlope * b.startVertex.location.x + aIntercept);
  }

  const x = (bIntercept - aIntercept) / (aSlope - bSlope);
  const y = aSlope * x + aIntercept;

  return new Point (x, y);
}

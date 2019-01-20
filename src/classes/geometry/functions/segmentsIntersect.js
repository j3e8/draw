const Point = require('../point');
const bisectSegment = require('./bisectSegment');
const boundsOfSegment = require('./boundsOfSegment');
const boundsOverlap = require('./boundsOverlap');

const INSIGNIFICANT_AREA_THRESHOLD = 0.000001;

module.exports = function segmentsIntersect(controlSegment, testSegment) {
  if (testSegment.startVertex.controlAfter || testSegment.endVertex.controlBefore) {
    // bezier
    return bezierIntersection(controlSegment, testSegment)
  } else {
    // straight line
    return straightLineIntersection(controlSegment, testSegment);
  }
}

function bezierIntersection (controlSegment, bezierSegment) {
  const controlSegmentBounds = boundsOfSegment(controlSegment);
  const testSegmentBounds = boundsOfSegment(bezierSegment);

  if (!boundsOverlap(controlSegmentBounds, testSegmentBounds)) {
    return false;
  }

  // If we've recursed enough to get a very small curve, we can treat it as straight and be done
  if (testSegmentBounds.getArea() < INSIGNIFICANT_AREA_THRESHOLD) {
    return straightLineIntersection(controlSegment, bezierSegment);
  }

  const subsegments = bisectSegment(bezierSegment);
  return bezierIntersection(controlSegment, subsegments[0]) || bezierIntersection(controlSegment, subsegments[1]);
}

function straightLineIntersection (controlSegment, testSegment) {
  const controlSlope = (controlSegment.endVertex.location.y - controlSegment.startVertex.location.y) / (controlSegment.endVertex.location.x - controlSegment.startVertex.location.x);
  const controlIntercept = controlSegment.endVertex.location.y - controlSlope * controlSegment.endVertex.location.x;
  const testSlope = (testSegment.endVertex.location.y - testSegment.startVertex.location.y) / (testSegment.endVertex.location.x - testSegment.startVertex.location.x);
  const testIntercept = testSegment.endVertex.location.y - testSlope * testSegment.endVertex.location.x;

  if (controlSlope === testSlope) { // edge case would cause divide by zero
    return controlSegment.startVertex.location.x === testSegment.startVertex.location.x ? controlSegment.startVertex.location : null; // if they're the same line, return the startVertex.location, otherwise null
  }

  if (controlSlope === Infinity) { // vertical first line only
    return new Point(controlSegment.startVertex.location.x, testSlope * controlSegment.startVertex.location.x + testIntercept);
  } else if (testSlope === Infinity) { // vertical second line
    return new Point(testSegment.startVertex.location.x, controlSlope * testSegment.startVertex.location.x + controlIntercept);
  }

  const x = (testIntercept - controlIntercept) / (controlSlope - testSlope);
  const y = controlSlope * x + controlIntercept;

  const intersection = new Point (x, y);

  const controlSegmentBounds = boundsOfSegment(controlSegment);
  const testSegmentBounds = boundsOfSegment(testSegment);
  if (controlSegmentBounds.containsPoint(intersection) && testSegmentBounds.containsPoint(intersection)) {
    return intersection;
  }
  return false;
}

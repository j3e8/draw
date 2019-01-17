const Segment = require('../segment');
const calculateSegmentLength = require('./calculateSegmentLength');
const dataAlongSegment = require('./dataAlongSegment');

module.exports = function dataAtPositionOnPath (path, pct) {
  if (!path) {
    throw new Error("No path provided");
  }

  const pathLength = path.calculatePathLength();
  let distanceToTravelAlongPath = pct * pathLength;

  let vert = path.getFirstVertex();
  while (vert.nextVertex) {
    const segment = new Segment(vert, vert.nextVertex);
    const len = calculateSegmentLength(segment);
    if (distanceToTravelAlongPath - len <= 0) {
      // our position lies within this line segment
      return dataAlongSegment(distanceToTravelAlongPath, segment);
    }
    distanceToTravelAlongPath -= len;
    vert = vert.nextVertex;
  }

  if (path.isClosed) {
    return dataAlongSegment(distanceToTravelAlongPath, new Segment(vert, path.getFirstVertex()));
  }

  throw new Error("Couldn't find a location on the path");
}

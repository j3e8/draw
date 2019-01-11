const calculatePathLength = require('./calculatePathLength');
const calculateSegmentLength = require('./calculateSegmentLength');
const locationAlongSegment = require('./locationAlongSegment');

module.exports = function locationAtPositionOnPath (path, pct) {
  if (!path) {
    throw new Error("No path provided");
  }

  const pathLength = calculatePathLength(path);
  let distanceToTravelAlongPath = pct * pathLength;

  let vert = path.getFirstVertex();
  while (vert.nextVertex) {
    const len = calculateSegmentLength(vert, vert.nextVertex);
    if (distanceToTravelAlongPath - len <= 0) {
      // our position lies within this line segment
      return locationAlongSegment(distanceToTravelAlongPath, vert, vert.nextVertex);
    }
    distanceToTravelAlongPath -= len;
    vert = vert.nextVertex;
  }

  throw new Error("Couldn't find a location on the path");
}

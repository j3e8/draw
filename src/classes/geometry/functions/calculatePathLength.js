const calculateSegmentLength = require('./calculateSegmentLength');

module.exports = function calculatePathLength (path) {
  if (!path) {
    return 0;
  }

  let sum = 0;
  let vert = path.getFirstVertex();
  while (vert.nextVertex) {
    sum += calculateSegmentLength(vert, vert.nextVertex);
    vert = vert.nextVertex;
  }

  return sum;
}

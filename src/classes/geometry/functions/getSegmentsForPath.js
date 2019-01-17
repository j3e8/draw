const Segment = require('../segment');

module.exports = function getSegmentsForPath (path, isClosedStrict = false) {
  let numSegments = countSegments(path, isClosedStrict);

  if (!numSegments) {
    return [];
  }

  const segments = new Array(numSegments);
  let vert = path.getFirstVertex();
  let i = 0;
  while (vert.nextVertex) {
    segments[i] = new Segment(vert, vert.nextVertex);
    i++;
    vert = vert.nextVertex;
  }
  if ((path.isClosed || !isClosedStrict) && numSegments > 2) {
    segments[i] = new Segment(vert, path.getFirstVertex());
  }
  return segments;
}

function countSegments (path, isClosedStrict) {
  let num = 0;
  let vert = path.getFirstVertex();
  while (vert) {
    num++;
    vert = vert.nextVertex;
  }
  if (!path.isClosed && isClosedStrict) {
    num--;
  }
  return num;
}

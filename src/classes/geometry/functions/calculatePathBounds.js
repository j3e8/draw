const Area = require('../area');

module.exports = function calculatePathBounds (path) {
  if (!path) {
    throw new Error("No path provided");
  }
  const firstVertex = path.getFirstVertex();

  let minX = firstVertex.location.x;
  let minY = firstVertex.location.y;
  let maxX = firstVertex.location.x;
  let maxY = firstVertex.location.y;

  let vert = firstVertex;
  while (vert) {
    if (vert.location.x < minX) {
      minX = vert.location.x;
    } else if (vert.location.x > maxX) {
      maxX = vert.location.x;
    }
    if (vert.controlBefore && vert.controlBefore.x < minX) {
      minX = vert.controlBefore.x;
    } else if (vert.controlBefore && vert.controlBefore.x > maxX) {
      maxX = vert.controlBefore.x;
    }
    if (vert.controlAfter && vert.controlAfter.x < minX) {
      minX = vert.controlAfter.x;
    } else if (vert.controlAfter && vert.controlAfter.x > maxX) {
      maxX = vert.controlAfter.x;
    }

    if (vert.location.y < minY) {
      minY = vert.location.y;
    } else if (vert.location.y > maxY) {
      maxY = vert.location.y;
    }
    if (vert.controlBefore && vert.controlBefore.y < minY) {
      minY = vert.controlBefore.y;
    } else if (vert.controlBefore && vert.controlBefore.y > maxY) {
      maxY = vert.controlBefore.y;
    }
    if (vert.controlAfter && vert.controlAfter.y < minY) {
      minY = vert.controlAfter.y;
    } else if (vert.controlAfter && vert.controlAfter.y > maxY) {
      maxY = vert.controlAfter.y;
    }

    vert = vert.nextVertex;
  }

  return new Area(minX, minY, maxX - minX, maxY - minY);
}

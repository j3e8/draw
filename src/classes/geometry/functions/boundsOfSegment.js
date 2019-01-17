const Area = require('../area');

module.exports = function boundsOfSegment (segment) {
  if (!segment) {
    throw new Error("No segment provided");
  }
  const minX = Math.min(segment.startVertex.location.x, segment.endVertex.location.x);
  const minY = Math.min(segment.startVertex.location.y, segment.endVertex.location.y);
  const maxX = Math.max(segment.startVertex.location.x, segment.endVertex.location.x);
  const maxY = Math.max(segment.startVertex.location.y, segment.endVertex.location.y);

  return new Area(minX, minY, maxX - minX, maxY - minY);
}

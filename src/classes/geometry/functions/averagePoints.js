const Point = require('../point');

module.exports = function averagePoints (a, aweight, b, bweight) {
  return new Point(
    a.x * aweight + b.x * bweight,
    a.y * aweight + b.y * bweight,
  );
}

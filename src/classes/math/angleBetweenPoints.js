module.exports = function angleBetweenPoints (a, b) {
  const rise = b.y - a.y;
  const run = b.x - a.x;
  if (run === 0) {
    return rise > 0
      ? Math.PI * 1.5
      : Math.PI * 0.5;
  }
  const slope = rise / run;
  let angle = Math.atan(slope);
  if (run < 0) {
    angle += Math.PI * 2;
  }
  return angle;
}

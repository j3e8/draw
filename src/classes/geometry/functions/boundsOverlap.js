module.exports = function boundsOverlap (a, b) {
  if (a.right < b.left || a.left > b.right) {
    return false;
  }
  if (a.top > b.bottom || a.bottom < b.top) {
    return false;
  }
  return true;
}

module.exports = function debounce(fn, ms) {
  if (!ms) {
    ms = 50;
  }
  clearTimeout(fn);
  setTimeout(fn.bind(this), ms);
}

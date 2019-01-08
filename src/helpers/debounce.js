const timers = {};

module.exports = function debounce(fn, ms) {
  if (!ms) {
    ms = 50;
  }

  clearTimeout(timers[fn.toString()]);
  timers[fn.toString()] = setTimeout(fn.bind(this), ms);
}

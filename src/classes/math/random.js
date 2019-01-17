function positiveOrNegative() {
  return Math.random() < 0.5 ? -1 : 1;
}

function between(min, max) {
  return min + Math.random() * (max - min);
}

module.exports = {
  between,
  positiveOrNegative,
}

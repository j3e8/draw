class Range {
  constructor (a, b) {
    this.min = Math.min(a, b);
    this.max = Math.max(a, b);
  }

  getRange () {
    return this.max - this.min;
  }

  randomValue () {
    return Math.random() * (this.max - this.min) + this.min;
  }

  valueAsPercentOfRange (value) {
    return (value - this.min) / this.getRange();
  }
}

module.exports = Range;

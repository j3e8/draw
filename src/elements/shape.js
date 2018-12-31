const Element = require('./element');
const SystemColors = require('../color/systemColors');

class Shape extends Element {
  constructor(attributes) {
    super();
    this.fill = attributes.fill !== undefined ? attributes.fill : SystemColors.DEFAULT_FILL.toString();
    this.stroke = attributes.stroke !== undefined ? attributes.stroke : SystemColors.DEFAULT_STROKE.toString();
    this.strokeWidth = attributes.strokeWidth !== undefined ? attributes.strokeWidth : null;
  }
}

module.exports = Shape;

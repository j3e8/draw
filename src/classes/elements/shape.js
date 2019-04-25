const Element = require('./element');
const SystemColors = require('../color/systemColors');

class Shape extends Element {
  constructor(attributes) {
    super();
    this.fillColor = attributes.fillColor !== undefined ? attributes.fillColor : SystemColors.DEFAULT_FILL.toString();
    this.fill = attributes.fill;
    this.strokeColor = attributes.strokeColor !== undefined ? attributes.strokeColor : SystemColors.DEFAULT_STROKE.toString();
    this.stroke = attributes.stroke ? attributes.stroke.map(stroke => new stroke(attributes)) : [];
    this.strokeWidth = attributes.strokeWidth !== undefined ? attributes.strokeWidth : null;
  }
}

module.exports = Shape;

const Element = require('./elements/element');
const Ellipse = require('./elements/ellipse');

const Color = require('./color/color');

const Point = require('./measures/point');
const Size = require('./measures/size');

class Layer {
  constructor (workspaceInterface) {
    this.workspace = workspaceInterface;
    this.elements = [ ];
    this.visible = true;
    this.locked = false;
  }

  addElement (element) {
    this.elements.push(element);
  }

  render (ctx) {
    this.elements.forEach((element) => {
      element.render(ctx);
    });
  }
}

module.exports = Layer;

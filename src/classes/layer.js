const Element = require('./elements/element');
const Ellipse = require('./elements/ellipse');

const Color = require('./color/color');

const Point = require('./geometry/point');
const Size = require('./geometry/size');

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

  render (ctx, scale) {
    this.elements.forEach((element) => {
      element.render(ctx, scale);
    });
  }
}

module.exports = Layer;

const Element = require('elements/element');
const Ellipse = require('elements/ellipse');

const Color = require('color/color');

const Point = require('measures/point');
const Size = require('measures/size');

class Layer {
  constructor (workspaceInterface) {
    this.workspace = workspaceInterface;
    this.elements = [ new Ellipse(new Point(-4.25, -5.5), new Size(8.5, 11), this.workspace.getCurrentElementAttributes()) ];
    this.visible = true;
    this.locked = false;
  }

  render (ctx) {
    console.log('render layer');
    this.elements.forEach((element) => {
      element.render(ctx);
    });
  }
}

module.exports = Layer;

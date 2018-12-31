import Tool from './tool';
import Color from '../color/color';
import Ellipse from '../elements/ellipse';

class EllipseTool extends Tool {
  constructor (appInterface) {
    super(appInterface);
    this.ellipse = null;
  }

  mouseDown (location) {
    this.startPoint = location;
    this.ellipse = new Ellipse(location, { width: 0, height: 0 }, this.app.getElementAttributes());
  }

  mouseMove (location) {
    this.endPoint = location;
    this.ellipse.setSize(Size.fromPoints(this.startPoint, this.endPoint));
  }

  mouseUp (location) {
    this.endPoint = location;
    this.ellipse.setSize(Size.fromPoints(this.startPoint, this.endPoint));
    appInterface.addElement(this.ellipse);
    this.ellipse = null;
  }

  render (ctx) {
    this.ellipse.render(ctx);
  }
}

module.exports = EllipseTool;

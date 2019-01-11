import Tool from './tool';
import Color from '../color/color';
import Area from '../geometry/area';
import Ellipse from '../elements/ellipse';
import MouseState from '../input/mouseState';

class EllipseTool extends Tool {
  constructor (appInterface) {
    super(appInterface);
    this.ellipse = null;
  }

  mouseDown (location) {
    this.startPoint = location;
    this.ellipse = new Ellipse(location, { width: 0, height: 0 }, this.app.getCurrentElementAttributes());
    return false;
  }

  mouseMove (location) {
    if (MouseState.isDragging && this.startPoint) {
      this.endPoint = location;
      const area = Area.fromPoints(this.startPoint, this.endPoint);
      this.ellipse.setLocation(area.location);
      this.ellipse.setSize(area.size);
      return true;
    }
    return false;
  }

  mouseUp (location) {
    if (this.startPoint) {
      this.endPoint = location;
      const area = Area.fromPoints(this.startPoint, this.endPoint);
      this.ellipse.setLocation(area.location);
      this.ellipse.setSize(area.size);
      this.app.addElementToWorkspace(this.ellipse);
      this.ellipse = null;
      return true;
    }
    return false;
  }

  render (ctx) {
    if (this.ellipse) {
      this.ellipse.render(ctx);
    }
  }
}

module.exports = EllipseTool;

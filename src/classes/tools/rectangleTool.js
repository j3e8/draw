import Tool from './tool';
import Color from '../color/color';
import Area from '../measures/area';
import Rectangle from '../elements/rectangle';

class RectangleTool extends Tool {
  constructor (appInterface) {
    super(appInterface);
    this.rectangle = null;
  }

  mouseDown (location) {
    console.log('start rectangle');
    this.startPoint = location;
    this.rectangle = new Rectangle(location, { width: 0, height: 0 }, this.app.getCurrentElementAttributes());
    return false;
  }

  mouseMove (location) {
    if (this.startPoint) {
      this.endPoint = location;
      const area = Area.fromPoints(this.startPoint, this.endPoint);
      this.rectangle.setLocation(area.location);
      this.rectangle.setSize(area.size);
      return true;
    }
    return false;
  }

  mouseUp (location) {
    if (this.startPoint) {
      this.endPoint = location;
      const area = Area.fromPoints(this.startPoint, this.endPoint);
      this.rectangle.setLocation(area.location);
      this.rectangle.setSize(area.size);
      this.app.addElementToWorkspace(this.rectangle);
      this.rectangle = null;
      return true;
    }
    return false;
  }

  render (ctx) {
    if (this.rectangle) {
      this.rectangle.render(ctx);
    }
  }
}

module.exports = RectangleTool;

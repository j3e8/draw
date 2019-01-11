import Tool from './tool';
import Color from '../color/color';
import Vertex from '../geometry/vertex';
import PathElement from '../elements/pathElement';

class PenTool extends Tool {
  constructor (appInterface) {
    super(appInterface);
    this.pathElement = null;
  }

  mouseDown (location) {
    this.startPoint = location;
    const vertex = new Vertex(location);
    if (!this.pathElement) {
      this.pathElement = new PathElement(vertex, this.app.getCurrentElementAttributes());
    } else {
      this.pathElement.addVertex(vertex);
    }
    console.log('mouseDown', this.pathElement);
    return false;
  }

  mouseMove (location) {
    if (this.startPoint) {
      this.nextPoint = location;
    }
    return true;
  }

  mouseUp (location) {
    if (this.startPoint) {
      this.nextPoint = location;
    }
    console.log('mouseUp', this.pathElement);
    return true;
  }

  render (ctx) {
    console.log('render');
    if (this.pathElement) {
      const tmp = new Vertex(this.nextPoint);
      this.pathElement.addVertex(tmp);
      this.pathElement.render(ctx);
      tmp.remove();
    }
  }
}

module.exports = PenTool;

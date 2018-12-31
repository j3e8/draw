import Artboard from './artboard';
import Area from './measures/area';
import Point from './measures/point';
import Size from './measures/size';
const MouseState = require('./input/mouseState');
const SystemColors = require('./color/systemColors');
const Layer = require('./layer');

const UNITS_INCHES = 1;
const UNITS_PX = 2;
const UNITS_MM = 3;
const DEFAULT_UNITS = UNITS_INCHES;
const DEFAULT_ARTBOARD_WIDTH = 8.5;
const DEFAULT_ARTBOARD_HEIGHT = 11;
const DEFAULT_ARTBOARD_X = -DEFAULT_ARTBOARD_WIDTH / 2;
const DEFAULT_ARTBOARD_Y = -DEFAULT_ARTBOARD_HEIGHT / 2;

const DEFAULT_STROKE_WIDTH = {};
DEFAULT_STROKE_WIDTH[UNITS_INCHES] = 0.014;
DEFAULT_STROKE_WIDTH[UNITS_PX] = 1.0;
DEFAULT_STROKE_WIDTH[UNITS_MM] = 0.355;

class Workspace {
  constructor (app, size) {
    this.app = app;
    this.size = size;
    const defaultArtboardSize = new Size(DEFAULT_ARTBOARD_WIDTH, DEFAULT_ARTBOARD_HEIGHT);
    this.artboards = [
      new Artboard(new Point(DEFAULT_ARTBOARD_X, DEFAULT_ARTBOARD_Y), defaultArtboardSize),
    ];
    const xRatio = DEFAULT_ARTBOARD_WIDTH / (size.width - 40);
    const yRatio = DEFAULT_ARTBOARD_HEIGHT / (size.height - 40);
    this.scale = Math.max(xRatio, yRatio); // world units per screen pixel
    this.units = DEFAULT_UNITS;
    this.center = new Point(0, 0); // in world coordinates

    // default attributes
    this.currentFill = SystemColors.DEFAULT_FILL.toString();
    this.currentStroke = SystemColors.DEFAULT_STROKE.toString();
    this.currentStrokeWidth = DEFAULT_STROKE_WIDTH[this.units];
    console.log('currentStrokeWidth', this.currentStrokeWidth);

    const workspaceInterface = {
      getCurrentElementAttributes: this.getCurrentElementAttributes.bind(this),
    };
    this.activeLayer = new Layer(workspaceInterface);
    this.layers = [ this.activeLayer ];
  }

  getCurrentElementAttributes () {
    console.log('getCurrentElementAttributes', this.currentStrokeWidth);
    return {
      fill: this.currentFill,
      stroke: this.currentStroke,
      strokeWidth: this.currentStrokeWidth,
    };
  }

  mouseDown (screenPoint) {
    console.log('workspace mouseDown', screenPoint);
    const worldPoint = this.screenPointToWorldPoint(screenPoint);
    console.log('world point', worldPoint);
    MouseState.mouseDown(worldPoint);
    const activeTool = this.app.getActiveTool();
    if (this.activeTool) {
      this.activeTool.mouseDown(worldPoint);
    }
  }

  mouseMove (screenPoint) {
    const worldPoint = this.screenPointToWorldPoint(screenPoint);
    MouseState.mouseMove(worldPoint);
    const activeTool = this.app.getActiveTool();
    if (this.activeTool) {
      this.activeTool.mouseMove(worldPoint);
    }
  }

  mouseUp (screenPoint) {
    const worldPoint = this.screenPointToWorldPoint(screenPoint);
    MouseState.mouseUp(worldPoint);
    const activeTool = this.app.getActiveTool();
    if (this.activeTool) {
      this.activeTool.mouseUp(worldPoint);
    }
  }

  getWorldArea () {
    const worldArea = new Area(
      this.center.x - this.scale * this.size.width / 2,
      this.center.y - this.scale * this.size.height / 2,
      this.size.width * this.scale,
      this.size.height * this.scale,
    );
    return worldArea;
  }

  screenPointToWorldPoint (screenPoint) {
    const size = this.app.getWorkspaceSize();
    // calculate top left of workspace in world coordinates (from known center)
    const worldArea = this.getWorldArea();
    return new Point(
      (screenPoint.x / size.width) * worldArea.width + worldArea.left,
      (screenPoint.y / size.height) * worldArea.height + worldArea.top,
    );
  }

  render (ctx) {
    console.log('render workspace', SystemColors.WORKSPACE.toString());

    // render workspace background
    ctx.fillStyle = SystemColors.WORKSPACE.toString();
    ctx.fillRect(0, 0, this.size.width, this.size.height);

    ctx.save();
      ctx.scale(1 / this.scale, 1 / this.scale);
      /*** BEGIN now we're in world coordinates ***/
      const worldArea = this.getWorldArea();
      ctx.translate(worldArea.width / 2 - this.center.x, worldArea.height / 2 - this.center.y);

      // render artboards
      this.artboards.forEach((artboard) => {
        artboard.render(ctx);
      });

      // render layers
      this.layers.forEach((layer) => {
        layer.render(ctx);
      });
      /*** END world coordinates ***/
    ctx.restore();
  }
}

module.exports = Workspace;

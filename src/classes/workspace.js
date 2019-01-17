import Artboard from './artboard';
import Area from './geometry/area';
import Point from './geometry/point';
import Size from './geometry/size';
const MouseState = require('./input/mouseState');
const SystemColors = require('./color/systemColors');
const Layer = require('./layer');

const VaryingThicknessStrokeStyle = require('./elements/styles/stroke/varyingThicknessStrokeStyle');
const PathElement = require('./elements/pathElement');
const Vertex = require('./geometry/vertex');

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
  constructor (app, size, pixelRatio) {
    this.app = app;
    this.backBufferCanvas = document.createElement('canvas');
    this.resize(size, pixelRatio);
    const defaultArtboardSize = new Size(DEFAULT_ARTBOARD_WIDTH, DEFAULT_ARTBOARD_HEIGHT);
    this.activeArtboard = new Artboard(new Point(DEFAULT_ARTBOARD_X, DEFAULT_ARTBOARD_Y), defaultArtboardSize);
    this.artboards = [ this.activeArtboard ];
    const xRatio = DEFAULT_ARTBOARD_WIDTH / (size.width - 40);
    const yRatio = DEFAULT_ARTBOARD_HEIGHT / (size.height - 40);
    this.scale = Math.max(xRatio, yRatio); // world units per screen pixel
    this.units = DEFAULT_UNITS;
    this.center = new Point(0, 0); // in world coordinates

    // default attributes
    this.currentFillColor = SystemColors.DEFAULT_FILL.toString();
    this.currentFill = null;
    this.currentStrokeColor = SystemColors.DEFAULT_STROKE.toString();
    this.currentStroke = VaryingThicknessStrokeStyle;
    this.currentStrokeWidth = DEFAULT_STROKE_WIDTH[this.units];

    const workspaceInterface = {
      getCurrentElementAttributes: this.getCurrentElementAttributes.bind(this),
    };
    this.activeLayer = new Layer(workspaceInterface);
    this.layers = [ this.activeLayer ];

    const f1 = new Vertex(new Point(-2, 0));
    const p = new PathElement(f1, this.getCurrentElementAttributes());
    p.addVertex(new Vertex(new Point(2, 0)));
    p.addVertex(new Vertex(new Point(2, 2)));
    p.addVertex(new Vertex(new Point(-2, 2)));
    p.closePath();
    this.addElement(p);
  }

  addElement (element) {
    this.activeLayer.addElement(element);
  }

  getCurrentElementAttributes () {
    return {
      fillColor: this.currentFillColor,
      fill: this.currentFill,
      strokeColor: this.currentStrokeColor,
      stroke: this.currentStroke,
      strokeWidth: this.currentStrokeWidth,
    };
  }

  getArtboardSize () {
    return this.activeArtboard.getSize();
  }

  setArtboardSize (size) {
    return this.activeArtboard.setSize(size);
  }

  resize (size, pixelRatio) {
    this.size = size;
    this.pixelRatio = pixelRatio;
    this.backBufferCanvas.width = size.width * pixelRatio;
    this.backBufferCanvas.height = size.height * pixelRatio;
    this.backBufferCanvas.style.width = `${size.width}px`;
    this.backBufferCanvas.style.height = `${size.height}px`;
  }

  mouseDown (screenPoint) {
    const worldPoint = this.screenPointToWorldPoint(screenPoint);
    MouseState.mouseDown(worldPoint);
    const activeTool = this.app.getActiveTool();
    if (activeTool) {
      return activeTool.mouseDown(worldPoint);
    }
    return false;
  }

  mouseMove (screenPoint) {
    const worldPoint = this.screenPointToWorldPoint(screenPoint);
    MouseState.mouseMove(worldPoint);
    const activeTool = this.app.getActiveTool();
    if (activeTool) {
      return activeTool.mouseMove(worldPoint);
    }
    return false;
  }

  mouseUp (screenPoint) {
    const worldPoint = this.screenPointToWorldPoint(screenPoint);
    MouseState.mouseUp(worldPoint);
    const activeTool = this.app.getActiveTool();
    if (activeTool) {
      return activeTool.mouseUp(worldPoint);
    }
    return false;
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
    // render workspace background
    ctx.fillStyle = SystemColors.WORKSPACE.toString();
    ctx.fillRect(0, 0, this.size.width, this.size.height);

    this.renderInWorldCoordinates(ctx, () => {
      // render artboards
      this.artboards.forEach((artboard) => {
        artboard.render(ctx);
      });

      // render layers
      this.layers.forEach((layer) => {
        layer.render(ctx);
      });
    });
  }

  refresh (ctx) {
    // blit from backbuffer to this context
    ctx.drawImage(this.backBufferCanvas, 0, 0);

    this.renderInWorldCoordinates(ctx, () => {
      // render whatever the active tool is doing
      const activeTool = this.app.getActiveTool();
      if (activeTool) {
        activeTool.render(ctx);
      }
    });
  }

  renderInWorldCoordinates (ctx, fn) {
    ctx.save();
    ctx.scale(1 / this.scale, 1 / this.scale);
    const worldArea = this.getWorldArea();
    ctx.translate(worldArea.width / 2 - this.center.x, worldArea.height / 2 - this.center.y);

    if (fn) {
      fn();
    }

    ctx.restore();
  }
}

module.exports = Workspace;

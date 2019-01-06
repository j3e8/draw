import Workspace from './workspace';
import Area from './measures/area';
import Point from './measures/point';
import SystemColors from './color/systemColors';
const { publish, subscribe } = require('../helpers/pubsub');

class Application {
  constructor (canvasElement, appSize, pixelRatio = 1) {
    this.appInterface = {
      addElementToWorkspace: this.addElementToWorkspace.bind(this),
      getActiveTool: this.getActiveTool.bind(this),
      getCurrentElementAttributes: this.getCurrentElementAttributes.bind(this),
      getArtboardSize: this.getArtboardSize.bind(this),
      getWorkspaceSize: this.getWorkspaceSize.bind(this),
    };

    subscribe('artboardSize', (size) => {
      this.activeWorkspace.setArtboardSize(size);
      this.render();
    });
  }

  setCanvas (canvasElement, appSize, pixelRatio = 1) {
    this.canvasElement = canvasElement;
    this.pixelRatio = pixelRatio;
    this.updateSize(appSize);
    this.activeWorkspace = new Workspace(this.appInterface, this.workspaceArea.size, this.pixelRatio);
    this.workspaces = [ this.activeWorkspace ];
  }

  setPixelRatio (pixelRatio = 1) {
    this.pixelRatio = pixelRatio;
  }

  addElementToWorkspace (element) {
    this.activeWorkspace.addElement(element);
    this.render();
  }

  getCurrentElementAttributes () {
    return this.activeWorkspace.getCurrentElementAttributes();
  }

  getActiveTool () {
    return this.activeTool;
  }

  setActiveTool (tool) {
    this.activeTool = tool;
  }

  getContext () {
    return this.canvasElement.getContext('2d');
  }

  getArtboardSize () {
    return this.activeWorkspace.getArtboardSize();
  }

  getWorkspaceSize () {
    return this.workspaceArea.size;
  }

  mouseDown (x, y) {
    if (!this.workspaceArea) {
      return;
    }
    const pt = new Point(x, y);
    if (this.workspaceArea.containsPoint(pt)) {
      const needsRefresh = this.activeWorkspace.mouseDown(pt.relativeToArea(this.workspaceArea));
      if (needsRefresh) {
        this.refresh();
      }
    }
  }

  mouseMove (x, y) {
    if (!this.workspaceArea) {
      return;
    }
    const pt = new Point(x, y);
    if (this.workspaceArea.containsPoint(pt)) {
      const needsRefresh = this.activeWorkspace.mouseMove(pt.relativeToArea(this.workspaceArea));
      if (needsRefresh) {
        this.refresh();
      }
    }
  }

  mouseUp (x, y) {
    if (!this.workspaceArea) {
      return;
    }
    const pt = new Point(x, y);
    if (this.workspaceArea.containsPoint(pt)) {
      const needsRefresh = this.activeWorkspace.mouseUp(pt.relativeToArea(this.workspaceArea));
      if (needsRefresh) {
        this.refresh();
      }
    }
  }

  updateSize (size) {
    this.size = size;
    this.workspaceArea = new Area(0, 0, this.size.width, this.size.height);
    if (this.workspaces) {
      this.workspaces.forEach((workspace) => {
        workspace.resize(this.workspaceArea.size, this.pixelRatio);
      });
      publish('artboardSize', this.activeWorkspace.getArtboardSize());
    }
  }

  render () {
    if (!this.canvasElement) {
      return;
    }
    const ctx = this.canvasElement.getContext('2d');

    // scale up for retina display
    ctx.save();
    ctx.scale(this.pixelRatio, this.pixelRatio);

    this.renderWorkspaces();

    ctx.restore();

    this.refresh();
  }

  renderWorkspaces () {
    this.workspaces.forEach((workspace) => {
      const ctx = workspace.backBufferCanvas.getContext('2d');
      workspace.render(ctx);
    });
  }

  refresh () {
    if (!this.canvasElement) {
      return;
    }
    const ctx = this.canvasElement.getContext('2d');

    // scale up for retina display
    ctx.save();
    ctx.scale(this.pixelRatio, this.pixelRatio);

    this.refreshWorkspaces(ctx);

    ctx.restore();
  }

  refreshWorkspaces (ctx) {
    ctx.save();
    ctx.translate(this.workspaceArea.left, this.workspaceArea.top); // translate to the top left corner of the workspace area
    this.workspaces.forEach((workspace) => {
      workspace.refresh(ctx);
    });
    ctx.restore();
  }
}

module.exports = Application;

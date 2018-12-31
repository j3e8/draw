import Workspace from './workspace';
import Toolbar from './ui/toolbar';
import Area from './measures/area';
import Point from './measures/point';
import SystemColors from './color/systemColors';

class Application {
  constructor (canvasElement, appSize, pixelRatio = 1) {
    this.canvasElement = canvasElement;
    this.updateSize(appSize);
    this.pixelRatio = pixelRatio;
    const appInterface = {
      getActiveTool: this.getActiveTool.bind(this),
      getCurrentElementAttributes: this.getCurrentElementAttributes.bind(this),
      getToolbarSize: this.getToolbarSize.bind(this),
      getWorkspaceSize: this.getWorkspaceSize.bind(this),
    };
    this.activeWorkspace = new Workspace(appInterface, this.size);
    this.workspaces = [ this.activeWorkspace ];
    this.toolbar = new Toolbar(appInterface);
  }

  setPixelRatio (pixelRatio = 1) {
    this.pixelRatio = pixelRatio;
  }

  getCurrentElementAttributes () {
    return this.activeWorkspace.getCurrentElementAttributes();
  }

  getActiveTool () {
    if (this.toolbar) {
      return this.toolbar.getActiveTool();
    }
    return null;
  }

  getToolbarSize () {
    return this.toolbarArea.size;
  }

  getWorkspaceSize () {
    return this.workspaceArea.size;
  }

  mouseDown (x, y) {
    if (!this.toolbarArea || !this.workspaceArea) {
      return;
    }
    const pt = new Point(x, y);
    console.log('application mouseDown', pt, this.workspaceArea);
    if (this.toolbarArea.containsPoint(pt)) {
      this.toolbar.mouseDown(pt.relativeToArea(this.toolbarArea));
    } else if (this.workspaceArea.containsPoint(pt)) {
      this.activeWorkspace.mouseDown(pt.relativeToArea(this.workspaceArea));
    }
  }

  mouseMove (x, y) {
    if (!this.toolbarArea || !this.workspaceArea) {
      return;
    }
    const pt = new Point(x, y);
    if (this.toolbarArea.containsPoint(pt)) {
      this.toolbar.mouseMove(pt.relativeToArea(this.toolbarArea));
    } else if (this.workspaceArea.containsPoint(pt)) {
      this.activeWorkspace.mouseMove(pt.relativeToArea(this.workspaceArea));
    }
  }

  mouseUp (x, y) {
    if (!this.toolbarArea || !this.workspaceArea) {
      return;
    }
    const pt = new Point(x, y);
    if (this.toolbarArea.containsPoint(pt)) {
      this.toolbar.mouseUp(pt.relativeToArea(this.toolbarArea));
    } else if (this.workspaceArea.containsPoint(pt)) {
      this.activeWorkspace.mouseUp(pt.relativeToArea(this.workspaceArea));
    }
  }

  updateSize (size) {
    this.size = size;
    this.toolbarArea = new Area(0, 0, 30, this.size.height);
    this.workspaceArea = new Area(this.toolbarArea.size.width, 0, this.size.width - this.toolbarArea.size.width, this.size.height);
  }

  render () {
    console.log('render application');
    const ctx = this.canvasElement.getContext('2d');

    // scale up for retina display
    ctx.save();
    ctx.scale(this.pixelRatio, this.pixelRatio);

    /*** Render the workspaces ***/
    ctx.save();
    ctx.translate(this.workspaceArea.left, this.workspaceArea.top); // translate to the top left corner of the workspace area
    this.workspaces.forEach((workspace) => {
      workspace.render(ctx);
    });
    ctx.restore();

    /*** Render the toolbar ***/
    ctx.save();
    ctx.translate(this.toolbarArea.left, this.toolbarArea.top); // translate to the top left corner of the toolbar area
    this.toolbar.render(ctx);
    ctx.restore();

    ctx.restore();
  }
}

module.exports = Application;

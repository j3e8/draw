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
      addElementToWorkspace: this.addElementToWorkspace.bind(this),
      getActiveTool: this.getActiveTool.bind(this),
      getCurrentElementAttributes: this.getCurrentElementAttributes.bind(this),
      getToolbarSize: this.getToolbarSize.bind(this),
      getWorkspaceSize: this.getWorkspaceSize.bind(this),
    };
    this.activeWorkspace = new Workspace(appInterface, this.workspaceArea.size, this.pixelRatio);
    this.workspaces = [ this.activeWorkspace ];
    this.toolbar = new Toolbar(appInterface);
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
    if (this.toolbar) {
      console.log('this.toolbar.getActiveTool');
      return this.toolbar.getActiveTool();
    }
    return null;
  }

  getContext () {
    return this.canvasElement.getContext('2d');
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
      const needsRefresh = this.activeWorkspace.mouseDown(pt.relativeToArea(this.workspaceArea));
      if (needsRefresh) {
        this.refresh();
      }
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
      const needsRefresh = this.activeWorkspace.mouseMove(pt.relativeToArea(this.workspaceArea));
      if (needsRefresh) {
        this.refresh();
      }
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
      const needsRefresh = this.activeWorkspace.mouseUp(pt.relativeToArea(this.workspaceArea));
      if (needsRefresh) {
        this.refresh();
      }
    }
  }

  updateSize (size) {
    this.size = size;
    this.toolbarArea = new Area(0, 0, 30, this.size.height);
    this.workspaceArea = new Area(this.toolbarArea.size.width, 0, this.size.width - this.toolbarArea.size.width, this.size.height);
    if (this.workspaces) {
      this.workspaces.forEach((workspace) => {
        workspace.resizeBackBuffer(this.workspaceArea.size, this.pixelRatio);
      });
    }
  }

  render () {
    console.log('render application');
    const ctx = this.canvasElement.getContext('2d');

    // scale up for retina display
    ctx.save();
    ctx.scale(this.pixelRatio, this.pixelRatio);

    this.renderWorkspaces();
    this.renderToolbar(ctx);

    ctx.restore();

    this.refresh();
  }

  renderToolbar (ctx) {
    ctx.save();
    ctx.translate(this.toolbarArea.left, this.toolbarArea.top); // translate to the top left corner of the toolbar area
    this.toolbar.render(ctx);
    ctx.restore();
  }

  renderWorkspaces () {
    this.workspaces.forEach((workspace) => {
      const ctx = workspace.backBufferCanvas.getContext('2d');
      workspace.render(ctx);
    });
  }

  refresh () {
    console.log('refresh application');
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

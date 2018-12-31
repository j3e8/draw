import SystemColors from '../color/systemColors';
import ToolbarButton from './toolbarButton';
import EllipseTool from '../tools/ellipseTool';
import PencilTool from '../tools/pencilTool';

import Icon from './icon';
import Point from '../measures/point';
import Size from '../measures/size';

class Toolbar {
  constructor (appInterface) {
    this.app = appInterface;
    this.buttons = [
      new ToolbarButton(this, new EllipseTool(this.app), new Icon('images/toolbar/pencil.png')),
      new ToolbarButton(this, new PencilTool(this.app), new Icon('images/toolbar/pencil.png')),
    ];
    this.activeButton = this.buttons[0];
  }

  getActiveTool () {
    if (this.activeButton) {
      return this.activeButton.getTool();
    }
  }

  getToolbarButtonLocation (button) {
    const size = this.app.getToolbarSize();
    const square = size.width;
    const index = this.buttons.indexOf(button);
    return new Point(0, index * square);
  }

  getToolbarButtonSize () {
    const size = this.app.getToolbarSize();
    const square = size.width;
    return new Size(square, square);
  }

  render (ctx) {
    console.log('render toolbar');
    const size = this.app.getToolbarSize();
    ctx.fillStyle = SystemColors.TOOLBAR.toString();
    ctx.fillRect(0, 0, size.width, size.height);

    this.buttons.forEach((button) => {
      button.render(ctx);
    });
  }
}

module.exports = Toolbar;

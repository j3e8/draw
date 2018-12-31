import SystemColors from '../color/systemColors';
import Icon from './icon';

class ToolbarButton {
  constructor (toolbar, tool, icon) {
    this.toolbar = toolbar;
    this.tool = tool;
    this.icon = icon;
  }

  getTool () {
    return this.tool;
  }

  render (ctx) {
    const location = this.toolbar.getToolbarButtonLocation(this);
    const size = this.toolbar.getToolbarButtonSize();
    ctx.fillStyle = SystemColors.TOOLBAR_BUTTON.toString();
    ctx.fillRect(location.x, location.y, size.width, size.height);

    ctx.save();
    ctx.translate(location.x, location.y);
    this.icon.render(ctx, size, Icon.ICON_SIZE_CONTAIN);
    ctx.restore();
  }
}

module.exports = ToolbarButton;

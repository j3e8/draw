const Color = require('./color/color');
const SystemColors = require('./color/systemColors');

class Artboard {
  constructor (location, size) {
    this.location = location;
    this.size = size;
  }

  render (ctx) {
    console.log('render artboard', this.location, this.size, SystemColors.ARTBOARD.toString());
    ctx.fillStyle = SystemColors.ARTBOARD.toString();
    ctx.fillRect(this.location.x, this.location.y, this.size.width, this.size.height);
  }
}

module.exports = Artboard;

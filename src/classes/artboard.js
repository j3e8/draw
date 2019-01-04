const Color = require('./color/color');
const SystemColors = require('./color/systemColors');

class Artboard {
  constructor (location, size) {
    this.location = location;
    this.size = size;
  }

  render (ctx) {
    ctx.fillStyle = SystemColors.ARTBOARD.toString();
    ctx.fillRect(this.location.x, this.location.y, this.size.width, this.size.height);
  }
}

module.exports = Artboard;

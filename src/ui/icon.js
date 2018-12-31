import Size from '../measures/size';

class Icon {
  static ICON_SIZE_CONTAIN = 1;
  static ICON_SIZE_COVER = 2;

  constructor (path) {
    this.loaded = false;
    this.image = new Image();
    this.image.src = `www/${path}`;
    this.image.onload = () => {
      this.loaded = true;
      this.originalSize = new Size(this.image.width, this.image.height);
    }
  }

  render (ctx, size, sizingOption = Icon.ICON_SIZE_CONTAIN) {
    if (!this.loaded) {
      return;
    }

    console.log('render icon', size);

    if (sizingOption === Icon.ICON_SIZE_CONTAIN) {
      this.renderContained(ctx, size);
    } else if (sizingOption === Icon.ICON_SIZE_COVER) {
      this.renderCovered(ctx, size);
    }
  }

  renderContained (ctx, size) {
    const aspect = this.originalSize.width / this.originalSize.height;
    const w = aspect >= 1 ? size.width : size.height * aspect;
    const h = aspect >= 1 ? size.width / aspect : size.height;
    ctx.drawImage(this.image, 0, 0, w, h);
  }

  renderCovered (ctx, size) {
    const aspect = this.originalSize.width / this.originalSize.height;
    const w = aspect < 1 ? size.width : size.height * aspect;
    const h = aspect < 1 ? size.width / aspect : size.height;
    ctx.drawImage(this.image, 0, 0, w, h);
  }
}

module.exports = Icon;

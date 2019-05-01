const hex_r = /#([a-f0-9]{6})/i;
const rgb_r = /rgba?\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*(,\s*([0-9.]+)\s*)?\)/;

class Color {
  static blendColors(colorA, weightA, colorB, weightB) {
    let a = colorA;
    if (typeof(colorA) === 'string') {
      a = new Color(colorA);
    }
    let b = colorB;
    if (typeof(colorB) === 'string') {
      b = new Color(colorB);
    }
    const wa = weightA / (weightA + weightB);
    const wb = weightB / (weightA + weightB);
    return new Color(a.r * wa + b.r * wb,
                     a.g * wa + b.g * wb,
                     a.b * wa + b.b * wb,
                     a.a * wa + b.a * wb);
  }

  constructor(...args) {
    if (args.length === 1 && typeof (args[0]) === 'string') {
      this.parse(args[0]);
    } else if (args.length === 3 || args.length === 4 && typeof (args[0]) === 'number') {
      this.fromRGBA(...args);
    }
  }

  multiplyAlpha(value) {
    const pct = parseFloat(value, 10) || 1;
    this.a *= pct;
    return this;
  }

  parse(str) {
    if (hex_r.test(str)) {
      this.parseHex(str);
    } else if (rgb_r.test(str)) {
      this.parseRGB(str);
    }
  }

  parseHex(str) {
    const match = str.match(hex_r);
    const base16 = match[1];
    const r = base16.substring(0, 2);
    const g = base16.substring(2, 4);
    const b = base16.substring(4, 6);
    this.fromRGBA(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
  }

  parseRGB(str) {
    const match = str.match(rgb_r);
    const r = match[1];
    const g = match[2];
    const b = match[3];
    const a = match[5] || 1;
    this.fromRGBA(parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), parseFloat(a, 10));
  }

  fromRGBA(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toString() {
    const r = Math.floor(this.r);
    const g = Math.floor(this.g);
    const b = Math.floor(this.b);
    return this.a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${this.a})`;
  }
}

export default Color;

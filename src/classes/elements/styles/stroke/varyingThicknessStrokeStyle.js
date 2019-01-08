import StrokeStyle from './strokeStyle';
import Range from '../../../measures/range';
import SystemColors from '../../../color/systemColors';

const DEFAULT_TRANSITION_POINTS = 150;
const DEFAULT_START_THICKNESS = 0.25;
const DEFAULT_END_THICKNESS = 0.25;
const DEFAULT_MIN_THICKNESS = 0.67;
const DEFAULT_MAX_THICKNESS = 1.33;

class VaryingThicknessStrokeStyle extends StrokeStyle {
  constructor (options) {
    super();

    this.strokeWidth = options.strokeWidth || 1;
    this.strokeColor = options.strokeColor || SystemColors.DEFAULT_STROKE;

    this.transitionPoints = DEFAULT_TRANSITION_POINTS;
    this.startThickness = DEFAULT_START_THICKNESS;
    this.endThickness = DEFAULT_END_THICKNESS;
    this.ratioRange = new Range(DEFAULT_MIN_THICKNESS, DEFAULT_MAX_THICKNESS);
    this.initialize();
  }

  initialize () {
    const numPoints = this.transitionPoints + 2;
    this.points = new Array(numPoints);
    this.points[0] = {
      position: 0,
      thickness: this.startThickness,
    };
    this.points[numPoints - 1] = {
      position: 1,
      thickness: this.endThickness,
    };

    let lastPosition = 0;
    const intervalOffsetRange = new Range(0.75, 1.25);
    for (let i=1; i < numPoints - 1; i++) {
      const avgIncrementPerPoint = (1 - lastPosition) / (this.transitionPoints - i + 2);
      const p = lastPosition + intervalOffsetRange.randomValue() * avgIncrementPerPoint;
      console.log(lastPosition, avgIncrementPerPoint, p);
      this.points[i] = {
        position: p,
        thickness: this.ratioRange.randomValue(),
      };
      lastPosition = p;
    }
    console.log('initialized', this.points);
  }

  dataAtPosition (position) {
    if (position < 0 || position > 1) {
      throw new Error("Invalid position given for VaryingThicknessStrokeStyle.dataAtPosition()");
    }
    const results = this.findBoundingPoints(position);
    const boundingRange = new Range(results[1].position, results[0].position);
    const pct = boundingRange.valueAsPercentOfRange(position);
    const thickness = results[0].thickness * (1 - pct) + results[1].thickness * pct;
    return {
      thickness,
    };
  }

  findBoundingPoints (position) {
    for (let i=0; i < this.points.length - 1; i++) {
      if (this.points[i].position <= position && position <= this.points[i+1].position) {
        return [ this.points[i], this.points[i+1] ];
      }
    }
    return [ this.points[0], this.points[this.points.length - 1] ]; // this fallback should never be hit
  }

  render (ctx, shape) {
    const lineLength = shape.getTotalLineLength();
    const interval = this.strokeWidth * 0.05;

    ctx.fillStyle = this.strokeColor.toString();
    for (let i=0; i < lineLength; i+=interval) {
      const pos = i / lineLength;
      const location = shape.locationAtStrokePosition(pos);
      const data = this.dataAtPosition(pos);
      ctx.beginPath();
      ctx.arc(location.x, location.y, (data.thickness / 2) * this.strokeWidth, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

module.exports = VaryingThicknessStrokeStyle;

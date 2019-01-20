import StrokeStyle from './strokeStyle';
import Range from '../../../geometry/range';
import SystemColors from '../../../color/systemColors';

import Random from '../../../math/random';
import pointInsidePath from '../../../geometry/functions/pointInsidePath';
import getSegmentsForPath from '../../../geometry/functions/getSegmentsForPath';
import calculateSegmentLength from '../../../geometry/functions/calculateSegmentLength';
import dataAlongSegment from '../../../geometry/functions/dataAlongSegment';

const DEFAULT_TRANSITION_POINTS_PER_UNIT = 11;
const DEFAULT_START_THICKNESS = 0.25;
const DEFAULT_END_THICKNESS = 0.25;
const DEFAULT_MIN_THICKNESS = 0.4;
const DEFAULT_MAX_THICKNESS = 1.6;

class VaryingThicknessStrokeStyle extends StrokeStyle {
  constructor (options) {
    super();

    this.strokeWidth = options.strokeWidth || 1;
    this.strokeColor = options.strokeColor || SystemColors.DEFAULT_STROKE;

    this.transitionPointsPerUnit = DEFAULT_TRANSITION_POINTS_PER_UNIT;
    this.startThickness = DEFAULT_START_THICKNESS;
    this.endThickness = DEFAULT_END_THICKNESS;
    this.ratioRange = new Range(DEFAULT_MIN_THICKNESS, DEFAULT_MAX_THICKNESS);
  }

  choosePointsAlongPath (path) {
    const intervalOffsetRange = new Range(0.5, 1.5);
    const segments = getSegmentsForPath(path, true);

    this.points = segments.reduce((totalArray, segment, segmentIndex) => {
      const length = calculateSegmentLength(segment);
      const numPoints = Math.round(this.transitionPointsPerUnit * length) + 1; // plus one to automically include the first vertex
      const segmentPoints = new Array(numPoints);

      let currentPosition = 0;
      for (let i=0; i < numPoints; i++) {
        const result = dataAlongSegment(currentPosition * length, segment);
        segmentPoints[i] = {
          ...result,
          position: currentPosition,
          thickness: this.ratioRange.randomValue(),
        };
        const avgIncrementPerPoint = (1 - currentPosition) / (numPoints - i);
        currentPosition += intervalOffsetRange.randomValue() * avgIncrementPerPoint;
      }

      return totalArray.concat(segmentPoints);
    }, []);

    this.points[0].thickness = this.startThickness;

    // since we only render the start point of each segment, we need to manually add the end point of the last segment
    this.points.push({
      ...dataAlongSegment(1, segments[segments.length - 1]),
      thickness: this.endThickness,
    });
  }

  render (ctx, shape) {
    const path = shape.getPath();
    this.choosePointsAlongPath(path);

    if (this.points.length < 2) {
      return;
    }

    const innerPathPoints = new Array(this.points.length);
    const outerPathPoints = new Array(this.points.length);

    for (let i=0; i < this.points.length; i++) {
      let perpendicularAngle = this.points[i].angle + Math.PI * 0.5;
      if (perpendicularAngle > Math.PI * 2) {
        perpendicularAngle -= Math.PI * 2;
      }
      const distanceFromThalweg = this.points[i].thickness * this.strokeWidth;
      const dx = Math.cos(perpendicularAngle) * distanceFromThalweg;
      const dy = Math.sin(perpendicularAngle) * distanceFromThalweg;
      const pointA = {
        x: this.points[i].location.x + dx,
        y: this.points[i].location.y + dy,
      }
      const pointB = {
        x: this.points[i].location.x - dx,
        y: this.points[i].location.y - dy,
      }
      if (pointInsidePath(pointA, path)) {
        innerPathPoints[i] = pointA;
        outerPathPoints[i] = pointB;
      } else {
        innerPathPoints[i] = pointB;
        outerPathPoints[i] = pointA;
      }
    }

    ctx.fillStyle = this.strokeColor.toString();
    ctx.beginPath();
      ctx.moveTo(outerPathPoints[0].x, outerPathPoints[0].y);
      for (let i=1; i < outerPathPoints.length; i++) {
        ctx.lineTo(outerPathPoints[i].x, outerPathPoints[i].y);
      }
      for (let i=innerPathPoints.length - 1; i >= 0; i--) {
        ctx.lineTo(innerPathPoints[i].x, innerPathPoints[i].y);
      }
      ctx.closePath();
    ctx.fill();
  }
}

module.exports = VaryingThicknessStrokeStyle;

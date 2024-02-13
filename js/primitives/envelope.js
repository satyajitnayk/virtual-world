class Envelope {
  // Initialize the Envelope object with a skeleton
  // (a set of points defining the envelope's shape)
  constructor(skeleton, width, roundness = 1) {
    this.skeleton = skeleton;
    this.polygon = this.#generatePolygon(width, roundness);
  }

  #generatePolygon(width, roundness) {
    const { p1, p2 } = this.skeleton;
    const radius = width / 2;
    // angle between p1 and p2 along the x-axis.
    const alpha = angle(subtract(p1, p2));
    // angles in clockwise and counterclockwise directions relative to alpha.
    const alphaClockWise = alpha + Math.PI / 2;
    const alphaCounterClockWise = alpha - Math.PI / 2;

    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    const eps = step / 2;
    for (let i = alphaCounterClockWise; i <= alphaClockWise + eps; i += step) {
      points.push(translate(p1, i, radius));
    }

    for (let i = alphaCounterClockWise; i <= alphaClockWise + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points);
  }

  draw() {
    this.polygon.draw(ctx);
  }
}

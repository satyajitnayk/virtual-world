class Envelope {
  // Initialize the Envelope object with a skeleton
  // (a set of points defining the envelope's shape)
  constructor(skeleton, width) {
    this.skeleton = skeleton;
    this.polygon = this.#generatePolygon(width);
  }

  #generatePolygon(width) {
    const { p1, p2 } = this.skeleton;
    const radius = width / 2;
    // angle between p1 and p2 along the x-axis.
    const alpha = angle(subtract(p1, p2));
    // angles in clockwise and counterclockwise directions relative to alpha.
    const alphaClockWise = alpha + Math.PI / 2;
    const alphaCounterClockWise = alpha - Math.PI / 2;
    // offset points from p1 and p2 in counterclockwise direction.
    const p1OffsetCounterCloskWise = translate(
      p1,
      alphaCounterClockWise,
      radius
    );
    const p2OffsetCounterCloskWise = translate(
      p2,
      alphaCounterClockWise,
      radius
    );
    // offset points from p1 and p2 in clockwise direction.
    const p2OffsetCloskWise = translate(p2, alphaClockWise, radius);
    const p1OffsetCloskWise = translate(p1, alphaClockWise, radius);

    return new Polygon([
      p1OffsetCounterCloskWise,
      p2OffsetCounterCloskWise,
      p2OffsetCloskWise,
      p1OffsetCloskWise,
    ]);
  }

  draw() {
    this.polygon.draw(ctx);
  }
}

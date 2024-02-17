class Marking {
  constructor(center, directionVector, width, height) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;

    // get a support for it on the road segment center
    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2)
    );

    // convert the support to a polygon using envelope technique
    this.polygon = new Envelope(this.support, width, 0).polygon;

  }

  draw(ctx) {
    this.polygon.draw(ctx)
  }
}

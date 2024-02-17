class Crossing {
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

    // borders for CROSS sign
    this.borders = [this.polygon.segments[0], this.polygon.segments[2]];

  }

  draw(ctx) {
    const perpendicularLine = perpendicular(this.directionVector)
    const line = new Segment(
      add(this.center, scale(perpendicularLine, this.width / 2)),
      add(this.center, scale(perpendicularLine, -this.width / 2)),
    )
    line.draw(ctx, {width: +this.height, color: 'white', dash: [11, 11]})
  }
}

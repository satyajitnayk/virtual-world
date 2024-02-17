class Stop {
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

    // border for STOP sign
    this.border = this.polygon.segments[2];

  }

  draw(ctx) {
    this.border.draw(ctx, {width: 5, color: 'white'})
    // draw rotating text STOP
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);
    // scale the stop sign as in real world (vertically)
    ctx.scale(1, 3)

    ctx.beginPath();
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white'
    ctx.font = `bold ${this.height * 0.3}px Arial`
    ctx.fillText('STOP', 0, 1)

    ctx.restore()
  }
}

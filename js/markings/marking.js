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

    this.type = 'marking'
  }

  static load(info) {
    const point = new Point(info.center.x, info.center.y);
    const direction = new Point(info.directionVector.x, info.directionVector.y);
    switch (info.type) {
      case 'crossing':
        return new Crossing(point, direction, info.width, info.height);
      case 'light':
        return new Light(point, direction, info.width, info.height);
      case 'marking':
        return new Marking(point, direction, info.width, info.height);
      case 'parking':
        return new Parking(point, direction, info.width, info.height);
      case 'start':
        return new Start(point, direction, info.width, info.height);
      case 'stop':
        return new Stop(point, direction, info.width, info.height);
      case 'target':
        return new Target(point, direction, info.width, info.height);
      case 'yield':
        return new Yield(point, direction, info.width, info.height);
    }
  }

  draw(ctx) {
    this.polygon.draw(ctx)
  }
}

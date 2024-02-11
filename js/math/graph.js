class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  addPoint(point) {
    this.points.push(point);
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  conatinsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }

  tryAddPoint(point) {
    if (!this.conatinsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  containsSegment(segment) {
    return this.segments.find((s) => s.equals(segment));
  }

  tryAddSegment(segment) {
    // check segment not exists & points not equal in the segment
    if (!this.containsSegment(segment) && !segment.p1.equals(p2)) {
      this.addSegment(segment);
      return true;
    }
    return false;
  }

  removeSegment(segment) {
    // remove 1 element from index of segment
    this.segments.splice(this.segments.indexOf(segment), 1);
  }

  getSegmentsWithPoint(point) {
    const segments = [];
    for (const segment of this.segments) {
      if (segment.includes(point)) {
        segments.push(segment);
      }
    }
    return segments;
  }

  removePoint(point) {
    // point w.t.o segments make no sense so remove
    // segments associated with point as well
    const segments = this.getSegmentsWithPoint(point);
    for (const segment of segments) {
      this.removeSegment(segment);
    }
    // remove 1 element from index of segment
    this.points.splice(this.points.indexOf(point), 1);
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }

  draw(ctx) {
    for (const segment of this.segments) {
      segment.draw(ctx);
    }

    for (const point of this.points) {
      point.draw(ctx);
    }
  }
}

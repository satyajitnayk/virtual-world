class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  length() {
    return distance(this.p1, this.p2);
  }

  directionVector() {
    return normalize(subtract(this.p2, this.p1));
  }

  equals(segment) {
    return this.includes(segment.p1) && this.includes(segment.p2);
  }

  includes(point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  distanceToPoint(point) {
    const projection = this.projectPoint(point);
    // projection is b/w line
    if (projection.offset > 0 && projection.offset < 1) {
      return distance(point, projection.point);
    } else {
      const distToP1 = distance(point, this.p1);
      const distToP2 = distance(point, this.p2);
      return Math.min(distToP1, distToP2);
    }
  }

  projectPoint(point) {
    const a = subtract(point, this.p1);
    const b = subtract(this.p2, this.p1);
    const normB = normalize(b);
    const scaler = dot(a, normB);

    return {
      point: add(this.p1, scale(normB, scaler)),
      offset: scaler / magnitude(b),
    };
  }

  draw(ctx, {width = 2, color = "black", dash = [], cap = "butt"} = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = cap;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    // resetting so it does not affect following drawings
    ctx.setLineDash([]);
  }
}

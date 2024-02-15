class Polygon {
  constructor(points) {
    this.points = points;
    this.segments = [];
    for (let i = 1; i <= points.length; ++i) {
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  static multiBreak(polygons) {
    // exclude the last one
    for (let i = 0; i < polygons.length - 1; ++i) {
      for (let j = i + 1; j < polygons.length; ++j) {
        Polygon.break(polygons[i], polygons[j]);
      }
    }
  }

  static break(polygon1, polygon2) {
    const segments1 = polygon1.segments;
    const segments2 = polygon2.segments;
    for (let i = 0; i < segments1.length; ++i) {
      for (let j = 0; j < segments2.length; ++j) {
        const intersection = getIntersection(
          segments1[i].p1,
          segments1[i].p2,
          segments2[j].p1,
          segments2[j].p2
        );
        // check if not inersected at tips
        if (
          intersection &&
          intersection.offset != 1 &&
          intersection.offset != 0
        ) {
          const point = new Point(intersection.x, intersection.y);

          // add new point at intersections
          let aux = segments1[i].p2;
          segments1[i].p2 = point;
          /// remove lines inside polygon
          segments1.splice(i + 1, 0, new Segment(point, aux));

          aux = segments2[j].p2;
          segments2[j].p2 = point;
          /// remove lines inside polygon
          segments2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  drawSegments(ctx) {
    for (let segemnt of this.segments) {
      segemnt.draw(ctx, { color: getRandomColor(), width: 5 });
    }
  }

  draw(
    ctx,
    { stroke = 'blue', linewidth = 2, fill = 'rgba(0,0,255,0.3)' } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = linewidth;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; ++i) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

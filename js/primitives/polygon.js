class Polygon {
  constructor(points) {
    this.points = points;
    this.segments = [];
    for (let i = 1; i <= points.length; ++i) {
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  static load(info) {
    return new Polygon(info.points.map(p => new Point(p.x, p.y)))
  }

  /**
   * - Computes the union of multiple polygons represented by their segments.
   * - The union consists of segments that are not contained within any other polygon.
   *
   * @param {Polygon[]} polygons - An array of Polygon objects.
   * @returns {Segment[]} - An array of Segment objects representing
   *  the union of the polygons.
   */
  static union(polygons) {
    Polygon.multiBreak(polygons);
    const keptSegments = [];
    // Iterate through each polygon
    for (let i = 0; i < polygons.length; ++i) {
      // Iterate through each segment of the current polygon
      for (const segment of polygons[i].segments) {
        let keep = true;
        // remove segment if it is inside an envelope other than its own envelope
        for (let j = 0; j < polygons.length; ++j) {
          if (i !== j) {
            if (polygons[j].containsSegment(segment)) {
              keep = false;
              break;
            }
          }
        }
        // If the segment is not contained in any other polygon, add it to the union
        if (keep) {
          keptSegments.push(segment);
        }
      }
    }
    return keptSegments;
  }

  static multiBreak(polygons) {
    // exclude the last one
    for (let i = 0; i < polygons.length - 1; ++i) {
      for (let j = i + 1; j < polygons.length; ++j) {
        Polygon.break(polygons[i], polygons[j]);
      }
    }
  }

  /**
   * - Breaks the segments of two polygons where they intersect and
   * adds new points at the intersections.
   * - Removes lines inside polygons.
   *
   * @param {Polygon} polygon1 - The first Polygon object.
   * @param {Polygon} polygon2 - The second Polygon object.
   */
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
        // Check if there is an intersection that is not at the tips
        if (
          intersection &&
          intersection.offset !== 1 &&
          intersection.offset !== 0
        ) {
          // Create a new point at the intersection
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

  distanceToPoint(point) {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }

  distanceToPolygon(polygon) {
    return Math.min(this.points.map((p) => polygon.distanceToPoint(p)));
  }

  intersectsPolygon(polygon) {
    for (let s1 of this.segments) {
      for (let s2 of polygon.segments) {
        if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  containsSegment(segment) {
    const midpoint = average(segment.p1, segment.p2);
    // using this just to simplify
    return this.containsPoint(midpoint);
  }

  containsPoint(point) {
    // get an outer point - far point like (-1000,-1000)
    const outerPoint = new Point(-1000, -1000);
    let intersectionCount = 0;
    for (const segment of this.segments) {
      const intersection = getIntersection(
        outerPoint,
        point,
        segment.p1,
        segment.p2
      );
      if (intersection) {
        intersectionCount++;
      }
    }
    // if a point intersected even no of time it is outside else inside
    // refer to intersection.png
    return intersectionCount % 2 === 1;
  }

  drawSegments(ctx) {
    for (let segment of this.segments) {
      segment.draw(ctx, {color: getRandomColor(), width: 5});
    }
  }

  draw(
    ctx,
    {
      stroke = 'blue',
      lineWidth = 2,
      fill = 'rgba(0,0,255,0.3)',
      join = 'miter',
    } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = join;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; ++i) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

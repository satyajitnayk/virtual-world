class Building {
  // polygon for base
  constructor(polygon, height = 200) {
    this.base = polygon;
    this.height = height;
  }

  draw(ctx, viewPoint) {
    const topPoints = this.base.points.map((p) =>
      getFake3DPoint(p, viewPoint, this.height * 0.6)
    );
    const ceiling = new Polygon(topPoints);

    // connect 2 consecutive point from base to 2 consecutive points on ceiling
    const sides = [];
    for (let i = 0; i < this.base.points.length; ++i) {
      const nextI = (i + 1) % this.base.points.length;
      const polygon = new Polygon([
        this.base.points[i],
        this.base.points[nextI],
        topPoints[nextI],
        topPoints[i],
      ]);
      sides.push(polygon);
    }

    // draw sides away from viewPoint first & other side next to make it look real
    sides.sort(
      (polygon1, polygon2) =>
        polygon2.distanceToPoint(viewPoint) -
        polygon1.distanceToPoint(viewPoint)
    );

    const baseMidpoints = [
      average(this.base.points[0], this.base.points[1]),
      average(this.base.points[2], this.base.points[3]),
    ];

    const topMidPoints = baseMidpoints.map((p) =>
      getFake3DPoint(p, viewPoint, this.height)
    );

    const roofPolygons = [
      new Polygon([
        ceiling.points[0],
        ceiling.points[3],
        topMidPoints[1],
        topMidPoints[0],
      ]),
      new Polygon([
        ceiling.points[2],
        ceiling.points[1],
        topMidPoints[0],
        topMidPoints[1],
      ]),
    ];

    roofPolygons.sort(
      (poly1, poly2) =>
        poly2.distanceToPoint(viewPoint) - poly1.distanceToPoint(viewPoint)
    );

    this.base.draw(ctx, { fill: 'white', stroke: '#AAA' });
    for (const side of sides) {
      side.draw(ctx, { fill: 'white', stroke: '#AAA' });
    }
    ceiling.draw(ctx, { fill: 'white', stroke: '#AAA' });
    for (const polygon of roofPolygons) {
      polygon.draw(ctx, {
        fill: '#D44',
        stroke: '#C44',
        lineWidth: 8,
        join: 'round',
      });
    }
  }
}

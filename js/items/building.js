class Building {
  // polygon for base
  constructor(polygon, heightCoef = 0.4) {
    this.base = polygon;
    this.heightCoef = heightCoef;
  }

  draw(ctx, viewPoint) {
    const topPoints = this.base.points.map((p) =>
      add(p, scale(subtract(p, viewPoint), this.heightCoef))
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

    this.base.draw(ctx, { fill: 'white', stroke: '#AAA' });
    for (const side of sides) {
      side.draw(ctx, { fill: 'white', stroke: '#AAA' });
    }
    ceiling.draw(ctx, { fill: 'white', stroke: '#AAA' });
  }
}

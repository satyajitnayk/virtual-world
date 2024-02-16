class Tree {
  constructor(center, size, heightCoef = 0.3) {
    this.center = center;
    this.size = size; // base size of tree
    this.heightCoef = heightCoef;
    this.base = this.#generateLevel(center, size);
  }

  // draw irregular circle around point p with size
  #generateLevel(point, size) {
    const points = [];
    const radius = size / 2;
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 16) {
      // squaring cos will give b/w 0 to 1
      const kindOfRandom = Math.cos(((angle + this.center.x) * size) % 17) ** 2;
      const noisyRadius = radius * lerp(0.5, 1, kindOfRandom);
      points.push(translate(point, angle, noisyRadius));
    }
    return new Polygon(points);
  }

  draw(ctx, viewPoint) {
    const diff = subtract(this.center, viewPoint);
    const top = add(this.center, scale(diff, this.heightCoef));

    // put diffrent leveles to look like 3D
    const levelCount = 7;
    for (let level = 0; level < levelCount; ++level) {
      const t = level / (levelCount - 1);
      const point = lerp2D(this.center, top, t);
      // give each level different colors , darker towards top
      const color = `rgba(30,${lerp(50, 200, t)},70)`;
      // also make cirlce smaller towards top
      const size = lerp(this.size, 40, t);
      const polygon = this.#generateLevel(point, size);
      polygon.draw(ctx, { fill: color, stroke: 'rgba(0,0,0,0)' });
    }
  }
}

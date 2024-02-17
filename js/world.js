class World {
  constructor(
    graph,
    roadWidth = 100,
    roadRoundness = 10,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,
    treeSize = 160
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;
    this.treeSize = treeSize;

    this.envelopes = [];
    this.roadBorders = [];
    this.buildings = [];
    this.trees = [];
    this.laneGuides = []

    this.markings = [];

    this.frameCount = 0;

    this.generate();
  }

  static load(info) {
    const world = new World(new Graph())
    world.graph = Graph.load(info.graph)

    world.roadWidth = info.roadWidth;
    world.roadRoundness = info.roadRoundness;
    world.buildingWidth = info.buildingWidth;
    world.buildingMinLength = info.buildingMinLength;
    world.spacing = info.spacing;
    world.treeSize = info.treeSize;

    world.envelopes = info.envelopes.map(e => Envelope.load(e))
    world.roadBorders = info.roadBorders.map(b => new Segment(b.p1, b.p2))
    world.buildings = info.buildings.map(b => Building.load(b))
    world.trees = info.trees.map(t => new Tree(t.center, info.treeSize))
    world.laneGuides = info.laneGuides.map(g => new Segment(g.p1, g.p2))
    world.markings = info.markings.map(m => Marking.load(m))
    return world
  }

  generate() {
    this.envelopes.length = 0;
    for (const segment of this.graph.segments) {
      this.envelopes.push(
        new Envelope(segment, this.roadWidth, this.roadRoundness)
      );
    }

    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.polygon));
    this.buildings = this.#generateBuildings();
    this.trees = this.#generateTrees();
    this.laneGuides.length = 0;
    this.laneGuides.push(...this.#generateLaneGuides())
  }

  #generateLaneGuides() {
    const tmpEnvelopes = [];
    for (const segment of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(
          segment,
          this.roadWidth / 2,
          this.roadRoundness
        )
      );
    }
    return Polygon.union(tmpEnvelopes.map(e => e.polygon))
  }

  #generateTrees() {
    const points = [
      ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
      ...this.buildings.map((b) => b.base.points).flat(),
    ];
    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));

    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    // avoid generating trees inside or nearby building & roads
    const illegalPolygons = [
      ...this.buildings.map((b) => b.base),
      ...this.envelopes.map((e) => e.polygon),
    ];

    console.log;
    const trees = [];
    let tryCount = 0;
    while (tryCount < 100) {
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(bottom, top, Math.random())
      );

      let keep = true;
      // a remove tree if intersect with road or building
      for (const polygon of illegalPolygons) {
        if (
          polygon.containsPoint(p) ||
          polygon.distanceToPoint(p) < this.treeSize / 2
        ) {
          keep = false;
          break;
        }
      }

      // avoid intersecting trees
      if (keep) {
        for (const tree of trees) {
          if (distance(tree.center, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }

      // do not generate far away from road - at most 2 tree if far away
      if (keep) {
        let closeToSomething = false;
        for (const polygon of illegalPolygons) {
          if (polygon.distanceToPoint(p) < this.treeSize * 2) {
            closeToSomething = true;
            break;
          }
        }
        keep = closeToSomething;
      }

      if (keep) {
        tryCount = 0;
        trees.push(new Tree(p, this.treeSize));
      }
      tryCount++;
    }
    return trees;
  }

  #generateBuildings() {
    const tmpEnvelopes = [];
    for (const segment of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(
          segment,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness
        )
      );
    }

    // union of envelope polys
    const guides = Polygon.union(tmpEnvelopes.map((e) => e.polygon));

    // remove any segments of guides/unions that are smaller than min building size
    for (let i = 0; i < guides.length; ++i) {
      const segment = guides[i];
      if (segment.length() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    // add supports for new buildings (divide longer liens by building length)
    // draw first building segment
    const supports = [];
    for (let segment of guides) {
      const segmentLength = segment.length() + this.spacing;
      const buildingCount = Math.floor(
        segmentLength / (this.buildingMinLength + this.spacing)
      );
      // remove extra space we added above while dividing
      const buildingLength = segmentLength / buildingCount - this.spacing;

      const direction = segment.directionVector();
      let q1 = segment.p1;
      // scale along the building direction by buildingLength
      let q2 = add(q1, scale(direction, buildingLength));
      supports.push(new Segment(q1, q2));

      // draw remaining building starting from 2nd building as 1st one already drawn
      for (let i = 2; i <= buildingCount; ++i) {
        q1 = add(q2, scale(direction, this.spacing));
        q2 = add(q1, scale(direction, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    // add rectangular envelopes around supports -> look like buildings
    const bases = [];
    for (const segment of supports) {
      bases.push(new Envelope(segment, this.buildingWidth).polygon);
    }

    // remove one if any buildings intersecting
    const eps = 0.001;
    for (let i = 0; i < bases.length - 1; ++i) {
      for (let j = i + 1; j < bases.length; ++j) {
        if (
          bases[i].intersectsPolygon(bases[j]) ||
          bases[i].distanceToPolygon(bases[j]) < this.spacing - eps
        ) {
          bases.splice(j, 1);
          j--;
        }
      }
    }

    return bases.map((b) => new Building(b));
  }

  #getIntersections() {
    const subset = [];
    for (const point of this.graph.points) {
      let degree = 0;
      for (const segment of this.graph.segments) {
        if (segment.includes(point)) {
          degree++;
        }
      }

      if (degree > 2) {
        subset.push(point);
      }
    }
    return subset;
  }

  #updateLights() {
    const lights = this.markings.filter((m) => m instanceof Light);
    const controlCenters = [];
    for (const light of lights) {
      const point = getNearestPoint(light.center, this.#getIntersections());
      let controlCenter = controlCenters.find((c) => c.equals(point));
      if (!controlCenter) {
        controlCenter = new Point(point.x, point.y);
        controlCenter.lights = [light];
        controlCenters.push(controlCenter);
      } else {
        controlCenter.lights.push(light);
      }
    }
    const greenDuration = 2,
      yellowDuration = 1;
    for (const center of controlCenters) {
      center.ticks = center.lights.length * (greenDuration + yellowDuration);
    }
    const tick = Math.floor(this.frameCount / 60);
    for (const center of controlCenters) {
      const cTick = tick % center.ticks;
      const greenYellowIndex = Math.floor(
        cTick / (greenDuration + yellowDuration)
      );
      const greenYellowState =
        cTick % (greenDuration + yellowDuration) < greenDuration
          ? "green"
          : "yellow";
      for (let i = 0; i < center.lights.length; i++) {
        if (i === greenYellowIndex) {
          center.lights[i].state = greenYellowState;
        } else {
          center.lights[i].state = "red";
        }
      }
    }
    this.frameCount++;
  }

  draw(ctx, viewPoint) {
    this.#updateLights();

    for (const envelope of this.envelopes) {
      envelope.draw(ctx, {fill: '#BBB', stroke: '#BBB', lineWidth: 15});
    }

    for (const marking of this.markings) {
      marking.draw(ctx)
    }

    for (const segment of this.graph.segments) {
      segment.draw(ctx, {color: 'white', width: 4, dash: [10, 10]});
    }

    for (const segment of this.roadBorders) {
      segment.draw(ctx, {color: 'white', width: 4});
    }

    // sort trees & building according to distance from viewPoint
    // closer one drawn first - we will use their base to do sorting
    const items = [...this.buildings, ...this.trees];
    items.sort(
      (item1, item2) =>
        item2.base.distanceToPoint(viewPoint) -
        item1.base.distanceToPoint(viewPoint)
    );
    for (const item of items) {
      item.draw(ctx, viewPoint);
    }
  }
}

class World {
  constructor(graph, roadWidth = 100, roundness = 3) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roundness = roundness;

    this.envelopes = [];

    this.generate();
  }

  generate() {
    this.envelopes.length = 0;
    for (const segment of this.graph.segments) {
      this.envelopes.push(
        new Envelope(segment, this.roadWidth, this.roundness)
      );
    }
  }

  draw(ctx) {
    for (const envelope of this.envelopes) {
      envelope.draw(ctx);
    }
  }
}

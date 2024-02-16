class Tree {
  constructor(center, size) {
    this.center = center;
    this.size = size; // base size of tree
  }

  draw(ctx) {
    this.center.draw(ctx, { size: this.size, color: 'green' });

    const top = add(this.center, { x: -40, y: -40 });
    new Segment(this.center, top).draw(ctx);
  }
}

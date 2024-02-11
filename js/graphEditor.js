class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext('2d');

    // selected point
    this.selected = null;
    this.hovered = null;

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener('mousedown', (evt) => {
      if (evt.button == 2) {
        // right click
        if (this.hovered) {
          this.#removePoint(this.hovered);
        }
      }
      if (evt.button == 0) {
        // left click
        // get mouse pointer location
        const mousePoint = new Point(evt.offsetX, evt.offsetY);

        if (this.hovered) {
          this.selected = this.hovered;
          return;
        }
        this.graph.addPoint(mousePoint);
        this.selected = mousePoint;
        this.hovered = mousePoint;
      }
    });

    this.canvas.addEventListener('mousemove', (evt) => {
      // get mouse pointer location
      const mousePoint = new Point(evt.offsetX, evt.offsetY);
      // check if nearest point exists near mousePoint
      // add onlyselect it but do not add new point near it
      this.hovered = getNearestPoint(mousePoint, this.graph.points, 10);
    });
    // to prevent diaplying menu on clicking right btn in mouse
    this.canvas.addEventListener('contextmenu', (evt) => evt.preventDefault());
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    // check if selected & removed point are same
    // else keep slected point as it is
    if (this.selected == point) {
      this.selected = null;
    }
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}

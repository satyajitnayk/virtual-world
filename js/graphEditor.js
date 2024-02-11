class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext('2d');

    // selected point
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mousePoint = null;

    this.#addEventListeners();
  }

  #addEventListeners() {
    // handle mouse click event
    this.canvas.addEventListener('mousedown', (evt) => {
      // right click
      if (evt.button == 2) {
        if (this.hovered) {
          this.#removePoint(this.hovered);
        } else {
          this.selected = null;
        }
      }
      // left click
      if (evt.button == 0) {
        if (this.hovered) {
          // hovered to exisitng point
          this.#selectPoint(this.hovered);
          this.dragging = true;
          return;
        }
        this.graph.addPoint(this.mousePoint);
        // check if any point already slelected,
        // then draw line b/w it & current point
        this.#selectPoint(this.mousePoint);
        this.hovered = this.mousePoint;
      }
    });

    // handle mouse movements
    this.canvas.addEventListener('mousemove', (evt) => {
      // get mouse pointer location
      this.mousePoint = new Point(evt.offsetX, evt.offsetY);
      // check if nearest point exists near mousePoint
      // add onlyselect it but do not add new point near it
      this.hovered = getNearestPoint(this.mousePoint, this.graph.points, 10);
      if (this.dragging) {
        this.selected.x = this.mousePoint.x;
        this.selected.y = this.mousePoint.y;
      }
    });
    // to prevent diaplying menu on clicking right btn in mouse
    this.canvas.addEventListener('contextmenu', (evt) => evt.preventDefault());
    // handle releasing mouse button
    this.canvas.addEventListener('mouseup', () => (this.dragging = false));
  }

  #selectPoint(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
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
      // snap line to hovered point
      const intent = this.hovered ? this.hovered : this.mousePoint;
      // draw for context aware - what will happen next
      new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] }); // 3px line, 3px space
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}

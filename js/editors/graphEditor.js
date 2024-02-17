class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext('2d');

    // selected point
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mousePoint = null;
  }

  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.#removeEventListeners();
    this.selected = null;
    this.hovered = null;
  }

  #addEventListeners() {
    // storing the listener so that when we remove them we remove the same one we created
    // bind the 'handleMouseDown' method to the current context ('this').
    // This allows 'handleMouseDown' to access properties and methods of the current object.
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundMouseUp = () => (this.dragging = false);
    this.boundContextMenu = (evt) => evt.preventDefault();

    // handle mouse click event
    this.canvas.addEventListener('mousedown', this.boundMouseDown);
    // handle mouse movements
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
    // handle releasing mouse button
    this.canvas.addEventListener('mouseup', this.boundMouseUp);
    // to prevent diaplying menu on clicking right btn in mouse
    this.canvas.addEventListener('contextmenu', this.boundContextMenu);
  }

  #removeEventListeners() {
    this.canvas.removeEventListener('mousedown', this.boundMouseDown);
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
    this.canvas.removeEventListener('mouseup', this.boundMouseUp);
    this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
  }

  #handleMouseDown(evt) {
    // right click
    if (evt.button == 2) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        // right click while hovering deselect hovered point
        this.#removePoint(this.hovered);
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
  }

  #handleMouseMove(evt) {
    // get mouse pointer location
    this.mousePoint = this.viewport.getMousePoint(evt, true);
    // check if nearest point exists near mousePoint
    // add onlyselect it but do not add new point near it
    this.hovered = getNearestPoint(
      this.mousePoint,
      this.graph.points,
      10 * this.viewport.zoom
    );
    if (this.dragging) {
      this.selected.x = this.mousePoint.x;
      this.selected.y = this.mousePoint.y;
    }
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

  dispose() {
    this.graph.dispose();
    // reset hovered & selected
    this.selected = null;
    this.hovered = null;
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

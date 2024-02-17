class MarkingEditor {

  constructor(viewport, world, targetSegments) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext('2d');

    this.mousePoint = null;
    this.intent = null;

    this.targetSegments = targetSegments

    this.markings = world.markings
  }

  // to be overridden by child class
  createMarking(center, directionVector) {
    return center;
  }


  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.#removeEventListeners();
  }

  #addEventListeners() {
    // storing the listener so that when we remove them we remove the same one we created
    // bind the 'handleMouseDown' method to the current context ('this').
    // This allows 'handleMouseDown' to access properties and methods of the current object.
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundContextMenu = (evt) => evt.preventDefault();

    // handle mouse click event
    this.canvas.addEventListener('mousedown', this.boundMouseDown);
    // handle mouse movements
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
    // to prevent displaying menu on clicking right btn in mouse
    this.canvas.addEventListener('contextmenu', this.boundContextMenu);
  }

  #removeEventListeners() {
    this.canvas.removeEventListener('mousedown', this.boundMouseDown);
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
    this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
  }

  #handleMouseMove(evt) {
    // get mouse pointer location
    this.mousePoint = this.viewport.getMousePoint(evt, true);
    // check if nearest point exists near mousePoint
    // add only select it but do not add new point near it
    const segment = getNearestSegment(
      this.mousePoint,
      this.targetSegments,
      10 * this.viewport.zoom
    );
    // show context aware : where new stop mark will be going
    // to if we take mouse pointer near road
    if (segment) {
      // use projection of mouse point on road segment to draw stop sign on road
      const projection = segment.projectPoint(this.mousePoint);
      // bound projection to be on the line
      if (projection.offset >= 0 && projection.offset <= 1) {
        this.intent = this.createMarking(
          projection.point,
          segment.directionVector(),
        );
      } else {
        this.intent = null;
      }
    } else {
      this.intent = null;
    }
  }

  #handleMouseDown(evt) {
    if (evt.button === 0) { // left click
      if (this.intent) {
        this.markings.push(this.intent)
        this.intent = null
      }
    }
    // remove stop markings
    if (evt.button === 2) {//right click
      for (let i = 0; i < this.markings.length; ++i) {
        // get the polygon of the marking
        const polygon = this.markings[i].polygon;
        // check if right click is inside the polygon
        if (polygon.containsPoint(this.mousePoint)) {
          this.markings.splice(i, 1)
          return;
        }
      }
    }
  }

  display() {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}

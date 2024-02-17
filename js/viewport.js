class Viewport {
  constructor(canvas, zoom = 1, offset = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.zoom = zoom;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = offset ? offset : scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.#addEventListeners();
  }

  getMousePoint(evt, subtractDrafOffset = false) {
    const p = new Point(
      (evt.offsetX - this.center.x) * this.zoom - this.offset.x,
      (evt.offsetY - this.center.y) * this.zoom - this.offset.y
    );
    // subtractDrafOffset: to subtract dragoffset when dragging
    return subtractDrafOffset ? subtract(p, this.drag.offset) : p;
  }

  getOffset() {
    return add(this.offset, this.drag.offset);
  }

  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // save & restore called to prevent continuous zoom as scale called on each frame
    this.ctx.save();
    // translate to center of original drawing before each zoom
    this.ctx.translate(this.center.x, this.center.y);
    // zoom out
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    // show both viewport & drag offset together -> user can see as dragging in realtime
    const offset = this.getOffset();
    // translate - drag feature enabled
    this.ctx.translate(offset.x, offset.y);
  }

  #addEventListeners() {
    // handla mous wheel event
    this.canvas.addEventListener(
      'mousewheel',
      this.#handleMouseWheel.bind(this)
    );
    this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
  }

  #handleMouseDown(evt) {
    // check if evet from middle mouse button
    // or else it will interfare with graph editor
    if (evt.button == 1) {
      // middle button
      this.drag.start = this.getMousePoint(evt);
      this.drag.active = true;
    }
  }

  #handleMouseMove(evt) {
    if (this.drag.active) {
      // calculate the end location of mouse
      this.drag.end = this.getMousePoint(evt);
      this.drag.offset = subtract(this.drag.end, this.drag.start);
    }
  }

  #handleMouseUp(evt) {
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);
      // reset drag informations
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }

  #handleMouseWheel(evt) {
    // gives you how much we scrolled(+ve for up & -ve for down)
    const scrollDirection = Math.sign(evt.deltaY);
    const step = 0.1;
    this.zoom += scrollDirection * step;
    // cap zoom value b/w 1 & 5
    this.zoom = Math.max(1, Math.min(5, this.zoom));
  }
}

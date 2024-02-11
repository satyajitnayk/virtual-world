class Viewport {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.zoom = 1;

    this.#addEventListeners();
  }

  getMousePoint(evt) {
    return new Point(evt.offsetX * this.zoom, evt.offsetY * this.zoom);
  }

  #addEventListeners() {
    // handla mous wheel event
    this.canvas.addEventListener(
      'mousewheel',
      this.#handleMouseWheel.bind(this)
    );
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

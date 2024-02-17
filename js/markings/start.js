class Start extends Marking {
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, height)

    // display a car image
    this.image = new Image()
    this.image.src = "car.png"

    this.type = 'start'
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);

    ctx.drawImage(this.image, -this.width / 2, -this.height / 2)
    ctx.restore()
  }
}

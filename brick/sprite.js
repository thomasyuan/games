class Sprite {
  constructor(canvas, imagePath) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.image = this.#loadImage(imagePath);
  }

  #loadImage(path) {
    let image = new Image();
    image.src = path;
    image.onload = () => {
      this.initPosition();
      this.draw();
    };

    return image;
  }

  initPosition() {
    this.x = 0;
    this.y = 0;
  }

  erase() {
    this.context.clearRect(this.x, this.y, this.image.width, this.image.height);
  }

  draw() {
    this.context.drawImage(this.image, this.x, this.y);
  }
}
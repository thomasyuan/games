class Ball extends Sprite {
    constructor(canvas, imagePath) {
        super(canvas, imagePath);
        this.speedX = 1;
        this.speedY = 4;
    }

    update() {
        if (this.y > this.canvas.height) {
            return false;
        }

        if (
            this.x + this.speedX + this.image.width > this.canvas.width ||
            this.x + this.speedX < 0
        ) {
            this.speedX = -this.speedX;
        }

        if (this.y + this.speedY < 0) {
            this.speedY = -this.speedY;
        }

        this.erase();
        this.x += this.speedX;
        this.y += this.speedY;
        this.draw();

        return true;
    }

    collision(obj) {
        if (
            this.y + this.image.height >= obj.y &&
            this.y < obj.y &&
            this.x > obj.x &&
            this.x < obj.x + obj.image.width
        ) {
            return true;
        }

        return false;
    }

    change(x) {
        if (x != 0) {
            this.speedX = x - this.speedX;
        }
        this.speedY = -this.speedY;
    }

    reset() {
        this.initPosition();
        this.speedX = 1;
        this.speedY = 4;
    }

    initPosition() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
    }
}

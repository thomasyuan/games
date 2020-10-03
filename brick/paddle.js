class Paddle extends Sprite {
    constructor(canvas, imagePath) {
        super(canvas, imagePath)
        this.speed = 2
    }

    reset() {
        this.initPosition()
        this.draw()
    }

    update(move) {
        if (this.x + move + this.image.width > this.canvas.width
            || this.x + move < 0
            || move == 0) {
            return
        }

        this.erase()
        this.x += move
        this.draw()
    }

    initPosition() {
        this.x = (this.canvas.width / 2) - (this.image.width / 2)
        this.y = this.canvas.height * 0.8
    }
}

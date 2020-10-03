class Game {
    constructor() {
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        this.paddle = new Paddle(this.canvas, "bar.jpg")
        this.ball = new Ball(this.canvas, "ball.png")
        this.speed = 4
        this.move = 0
    }

    #registerKeyboardListener() {
        window.addEventListener('keydown', event => {
            const k = event.key
            if (k == 'a' || k == 'ArrowLeft') {
                this.move = -this.speed
            } else if (k == 'd' || k == 'ArrowRight') {
                this.move = this.speed
            } else if (k == ' ') {
                this.#restart()
            }
        })

        window.addEventListener('keyup', event => {
            this.move = 0
        })
    }

    #restart() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        clearInterval(this.interval)
        this.ball.reset()
        this.paddle.reset()
        this.#runLoop()
    }

    #gameOver() {
        this.paddle.erase()
        this.context.font = "64px Georgia"
        this.context.fillText("Game Over!", 220, 200)
        this.context.fillText("Press Space to Restart", 80, 300)
        clearInterval(this.interval)
    }

    #runLoop() {
        this.interval = setInterval(() => {
            let ok = this.ball.update()
            if (!ok) {
                this.#gameOver()
                return
            }

            if (this.ball.collision(this.paddle)) {
                this.ball.change(Math.sign(this.move))
            }

            this.paddle.update(this.move)
        }, 10)
    }

    start() {
        this.#registerKeyboardListener()
        this.#runLoop()
    }
}
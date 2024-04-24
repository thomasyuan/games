const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

function createFirework() {
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.position = "absolute";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  // Create an array to store the particles
  var particles = [];

  // Create 100 particles
  for (var i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2, // Start at the center of the canvas
      y: canvas.height, // Start at the bottom of the canvas
      speed: Math.random() * 5 + 1, // Random speed
      angle: Math.random() * Math.PI * 2, // Random angle
      size: Math.random() * 3 + 1, // Random size
      color: "hsl(" + Math.random() * 360 + ", 100%, 50%)", // Random color
    });
  }

  // Animation loop
  function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each particle
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Update the particle's position
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed - 1; // Subtract 1 to simulate gravity

      // Remove the particle if it's off the canvas
      if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
        particles.splice(i, 1);
        i--;
      }
    }

    // Stop the animation if all particles are gone
    if (particles.length === 0) {
      cancelAnimationFrame(animationId);
      document.body.removeChild(canvas);
    } else {
      animationId = requestAnimationFrame(animate);
    }
  }

  var animationId = requestAnimationFrame(animate);
}
class TetrisBlock {
  constructor(gameBoard, x, y, color, shape) {
    this.gameBoard = gameBoard;
    this.x = x;
    this.y = y;
    this.color = color;
    this.shape = shape;
    this.blockSize = this.gameBoard.blockSize;
  }

  draw() {
    this.gameBoard.context.fillStyle = this.color;
    this.gameBoard.context.strokeStyle = "black"; // Set the color of the border
    this.gameBoard.context.lineWidth = 2; // Set the width of the border
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j]) {
          let x = (this.x + j) * this.blockSize;
          let y = (this.y + i) * this.blockSize;
          this.gameBoard.context.fillRect(x, y, this.blockSize, this.blockSize);
          this.gameBoard.context.strokeRect(
            x,
            y,
            this.blockSize,
            this.blockSize
          ); // Draw the border
        }
      }
    }
  }
  collidesWith(board) {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (
          this.shape[y][x] &&
          (board[this.y + y] && board[this.y + y][this.x + x]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  removeFullLines() {
    let linesRemoved = 0;

    for (let y = this.gameBoard.boardHeight - 1; y >= 0; y--) {
      if (this.gameBoard.board[y].every((val) => val !== 0)) {
        this.gameBoard.board.splice(y, 1);
        this.gameBoard.board.unshift(
          Array.from({ length: this.gameBoard.boardWidth }, () => 0)
        );
        linesRemoved++;
        y++;
      }
    }

    switch (linesRemoved) {
      case 1:
        this.gameBoard.score += 10;
        break;
      case 2:
        this.gameBoard.score += 30;
        break;
      case 3:
        this.gameBoard.score += 50;
        break;
      case 4:
        this.gameBoard.score += 80;
        createFirework();
        break;
    }
    this.gameBoard.totalLines += linesRemoved;
    this.gameBoard.scoreElement.textContent = `Score: ${this.gameBoard.score}`;
    // every 20 lines, increase the level and decrease the delay 50 ms
    if (this.gameBoard.totalLines >= this.gameBoard.levelUpLines) {
      this.gameBoard.level++;
      this.gameBoard.delay -= 50;
      this.gameBoard.totalLines = 0;
      this.gameBoard.levelElement.textContent = `Level: ${this.gameBoard.level}`;
    }
  }

  moveDown() {
    this.y += 1;
    if (this.collidesWith(this.gameBoard.board)) {
      this.y -= 1;
      this.shape.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val) {
            this.gameBoard.board[this.y + y][this.x + x] = this.color;
          }
        });
      });
      this.gameBoard.block = this.gameBoard.nextBlock;
      this.gameBoard.nextBlock = this.gameBoard.blockFactory.getRandomBlock(); // Create a new block
      this.removeFullLines();
      this.gameBoard.showNextBlock();
      return false;
    }
    this.moved = true;
    return true;
  }

  moveLeft() {
    this.x -= 1;
    if (this.collidesWith(this.gameBoard.board)) {
      this.x += 1;
      return;
    }
    this.moved = true;
  }

  moveRight() {
    this.x += 1;
    if (this.collidesWith(this.gameBoard.board)) {
      this.x -= 1;
      return;
    }
    this.moved = true;
  }

  rotate() {
    const originalShape = this.shape;
    const newShape = this.shape[0].map((val, index) =>
      this.shape.map((row) => row[index])
    );
    this.shape = newShape.reverse();

    if (this.collidesWith(this.gameBoard.board)) {
      this.shape = originalShape;
      return;
    }
    this.moved = true;
  }
}

class GameBoard {
  constructor(canvasId, blockSize, boardHeight = 15, boardWidth = 11) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.nextBlockCanvas = document.getElementById("next-block");
    this.nextContext = this.nextBlockCanvas.getContext("2d");
    this.score = 0; // Add a score property
    this.scoreElement = document.getElementById("score"); // Get the score div
    this.level = 1; // Add a level property
    this.levelElement = document.getElementById("level"); // Get the level div
    this.delay = 1000; // Add a delay property
    this.lastTime = 0; // Add a lastTime property
    this.totalLines = 0; // Add a totalLines property
    this.levelUpLines = 1; // Add a levelUpLines property
    this.blockSize = blockSize;
    this.boardHeight = boardHeight;
    this.boardWidth = boardWidth;
    this.board = Array.from({ length: boardHeight }, () =>
      Array(boardWidth).fill(0)
    );
    this.blockFactory = new TetrisBlockFactory(this);
    this.block = this.blockFactory.getRandomBlock();
    this.nextBlock = this.blockFactory.getRandomBlock();
    this.showNextBlock();
  }

  showNextBlock() {
    // Clear the canvas
    this.nextContext.clearRect(
      0,
      0,
      this.nextBlockCanvas.width,
      this.nextBlockCanvas.height
    );

    // Calculate the top left position of the shape to center it
    const offsetX =
      (this.nextBlockCanvas.width -
        this.nextBlock.shape[0].length * this.blockSize) /
      2;
    const offsetY =
      (this.nextBlockCanvas.height -
        this.nextBlock.shape.length * this.blockSize) /
      2;

    this.nextContext.fillStyle = this.nextBlock.color;
    this.nextContext.strokeStyle = "black"; // Set the color of the border
    this.nextContext.lineWidth = 2; // Set the width of the border

    for (let y = 0; y < this.nextBlock.shape.length; y++) {
      for (let x = 0; x < this.nextBlock.shape[y].length; x++) {
        if (this.nextBlock.shape[y][x]) {
          this.nextContext.fillRect(
            offsetX + x * this.blockSize,
            offsetY + y * this.blockSize,
            this.blockSize,
            this.blockSize
          );
          this.nextContext.strokeRect(
            offsetX + x * this.blockSize,
            offsetY + y * this.blockSize,
            this.blockSize,
            this.blockSize
          ); // Draw the border
        }
      }
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.context.strokeStyle = "black"; // Set the color of the border
    this.context.lineWidth = 1; // Set the width of the border

    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x] !== 0) {
          this.context.fillStyle = this.board[y][x];
          this.context.fillRect(
            x * this.blockSize,
            y * this.blockSize,
            this.blockSize,
            this.blockSize
          );
          this.context.strokeRect(
            x * this.blockSize,
            y * this.blockSize,
            this.blockSize,
            this.blockSize
          ); // Draw the border
        }
      }
    }
  }
}

class TetrisBlockFactory {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.shapes = Object.values(SHAPES);
    this.colors = [
      "red",
      "green",
      "blue",
      "yellow",
      "purple",
      "orange",
      "cyan",
    ];
  }

  getRandomBlock() {
    const index = Math.floor(Math.random() * this.shapes.length);
    const shape = this.shapes[index];
    const color = this.colors[index];
    return new TetrisBlock(this.gameBoard, 5, 0, color, shape);
  }
}

var gameBoard;
document.addEventListener("DOMContentLoaded", (event) => {
  gameBoard = new GameBoard("game-board", 40);
  gameLoop();
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      gameBoard.block.moveDown();
      break;
    case "ArrowLeft":
      gameBoard.block.moveLeft();
      break;
    case "ArrowRight":
      gameBoard.block.moveRight();
      break;
    case "ArrowUp":
      gameBoard.block.rotate();
      break;
  }
});

function gameLoop(timestamp) {
  if (gameBoard.block.moved) {
    gameBoard.block.moved = false;
    gameBoard.clear();
    gameBoard.draw();
    gameBoard.block.draw();
    requestAnimationFrame(gameLoop);
    return;
  }
  if (timestamp - gameBoard.lastTime < gameBoard.delay) {
    requestAnimationFrame(gameLoop);
    return;
  }
  gameBoard.lastTime = timestamp;
  gameBoard.clear();
  gameBoard.draw();
  gameBoard.block.draw();
  if (!gameBoard.block.moveDown()) {
    // gameBoard.block = gameBoard.nextBlock;
    // gameBoard.nextBlock = gameBoard.blockFactory.getRandomBlock();
    if (gameBoard.block.collidesWith(gameBoard.board)) {
      // Game over
      gameBoard.context.fillStyle = "black";
      gameBoard.context.font = "30px Arial";
      gameBoard.context.fillText(
        "Game Over",
        gameBoard.canvas.width / 2,
        gameBoard.canvas.height / 2
      );
      return;
    }
  }
  requestAnimationFrame(gameLoop);
}

// document.getElementById('start-button').addEventListener('click', function() {
//     var button = document.getElementById('start-button');
//     if (button.innerHTML === 'Start') {
//         button.innerHTML = 'Pause';
//     } else {
//         button.innerHTML = 'Start';
//     }
// });

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let width = canvas.width;
let height = canvas.height;

let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;

// Create a border for the game
function drawBorder() {
    ctx.fillStyle = 'Gray';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
}

// Letting player know the score
function drawScore() {
    ctx.font = '20px Courier';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'top';
    ctx.fillText('Score: ' + score, blockSize, blockSize);
}

// Game Over message
function gameOver() {
    clearInterval(intervalId);
    ctx.font = '60px Courier';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
}

// Draw a circle
function circle (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

// Creating blocks
function Block (col, row) {
    this.col = col;
    this.row = row;
}

// Draw a square in the position of a cell
Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
}

// Draw a circle in the position of a cell
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
}

// Check if snake hit other block
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}

// Create the Snake
let Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = 'right';
    this.nextDirection = 'right';
}

// Draw the Snake
Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare('Blue');
    }
}

// Move the snake
Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === 'right') {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'down') {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === 'left') {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === 'up') {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
}

// Check if Snake hit smth
Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
}

// Control the Snake with the keyboard
let directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
}

$('body').keydown(function (event) {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
})

// Moving the Snake without hitting itself
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === 'up' && newDirection == 'down') {
        return;
    } else if (this.direction === 'right' && newDirection === 'left') {
        return;
    } else if (this.direction === 'down' && newDirection === 'up') {
        return;
    } else if (this.direction === 'left' && newDirection === 'right') {
        return;
    }

    this.nextDirection = newDirection;
}


// Creating the Apple
function Apple () {
    this.position = new Block(10, 10);
}

// Draw the Apple
Apple.prototype.draw = function () {
    this.position.drawCircle('LimeGreen');
}

// Move the Apple randomly
Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
}

// Create the Snake and the Apple
let snake = new Snake();
let apple = new Apple();

// Run the game
let intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);
/*jslint es6 */
/*jslint browser */
/*global window */
/*jslint devel: true */
/* jshint latedef:nofunc */

var canvas, canvasContext;
var brickSound, paddleSound;

var ballX = 75;
var ballSpeedX = 15;

var ballY = 75;
var ballSpeedY = 6;

var mouseX;
var mouseY;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COLS = 10;
const BRICK_GAP = 2;
const BRICK_ROWS = 14;
var bricksLeft = 0;

var brickGrid = new Array (BRICK_COLS * BRICK_ROWS);

const PADDLE_WIDTH = 120;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 40;
var paddleX = 400;

var gameOver = false;
var lives = 3;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("muted", "muted");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function updateMousePos (evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX - PADDLE_WIDTH  /2;

    /** Cheat to test ball where mouse is
    ballX = mouseX;
    ballY = mouseY;
    ballSpeedX = 3;
    ballSpeedY = -4; **/
}

function handleMouseClick(evt) {
    if (gameOver) {
        lives = 3;
        gameOver = false;
        brickReset();

    }
}

function brickReset () {
    bricksLeft = 0;
    var i;
    for (i = 0; i < 3 * BRICK_COLS; ++i) {
        brickGrid[i] = false;
    }
    for (i; i < BRICK_COLS * BRICK_ROWS; ++i) {
            brickGrid[i] = true;
            bricksLeft++;
        }
    }

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var FPS = 30;
    setInterval(updateAll, 1000/FPS);

    canvas.addEventListener('mousemove', updateMousePos);
    canvas.addEventListener("mousedown", handleMouseClick);

    brickSound = new sound("assets/brickHit.wav");
    paddleSound = new sound("assets/paddleHit.wav");
    brickReset();
    ballReset();
}

function updateAll () {
    moveAll();
    drawAll();
}

function ballReset () {
    if (lives == 0) {
        gameOver = true;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}
// ---------------------------------------- MOVEMENT FUNCTIONS --------------------------------
function moveAll () {
    if (gameOver) {
        return;
    }
    moveBall();
    ballBrickHandler();
    ballPaddleHandler();
}

function moveBall () {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if(ballX > canvas.width && ballSpeedX > 0.0) { // right
        ballSpeedX = -ballSpeedX;
    }
    if (ballX < 0 && ballSpeedX < 0.0){ // left
        ballSpeedX = -ballSpeedX;
    }
    if (ballY < 0 && ballSpeedY < 0.0) { //Top
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) { // bottom
        ballReset();
        --lives;
        if (lives < 0) {
            gameOver = true;
        }
    }
}

function isBrickAtColRow(col, row) {
    if (col >= 0 && col < BRICK_COLS &&
        row >= 0 && row < BRICK_ROWS) {
        var brickIndexUnderCoord = getArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    } else {
        return false;
    }
}

function ballBrickHandler () {
    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = getArrayIndex(ballBrickCol, ballBrickRow);

    if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
        ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

        if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
            brickSound.play();
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            console.log(bricksLeft);

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);
            var bothTestsFailed = true;

            if (prevBrickCol != ballBrickCol) {
                if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
                    ballSpeedX = -ballSpeedX;
                    bothTestsFailed = false;
                }
            }
            if (prevBrickRow != ballBrickRow) {
                if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
                    ballSpeedY = -ballSpeedY;
                    bothTestsFailed = false;
                }
            }

            if (bothTestsFailed) { // Prevents ball from going through diagnally.
                ballSpeedX = -ballSpeedX;
                ballSpeedY = -ballSpeedY;
            }
        } // end of bricK found
    } // end of valid col and row
} // end of ballBrickHandler

function ballPaddleHandler () {
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleX + PADDLE_WIDTH;
    if (ballY > paddleTopEdgeY && // Below top of paddle
        ballY < paddleBottomEdgeY && // above bottom of paddle
        ballX > paddleLeftEdgeX && // right of the left side of the paddle
        ballX < paddleRightEdgeX) { // left of the right side of paddle

        paddleSound.play();
        ballSpeedX *= 1.02;
        ballSpeedY *= 1.02;
        ballSpeedY = -ballSpeedY;

        var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.35;

        if (bricksLeft == 0) {
            brickReset();
        } //out of bricks
    } // paddle enters on the ball
}
// ------------------------------------ DRAW FUNCTIONS ----------------------------------------
function drawAll () {
    colorRect(0, 0, canvas.width, canvas.height, "#f1f1f1");
    if (gameOver) {
        // Draw Canvas
        colorText("Game Over!", 350, 300, "Red");
        colorText("Click to Continue", 350, 500, "Red");
        return;
    }

        // Draw ball
        colorCircle(ballX, ballY, 10, 'black');

        // Draw paddle
        colorRect(paddleX - 1, canvas.height - (PADDLE_DIST_FROM_EDGE + 1) , PADDLE_WIDTH + 2, PADDLE_THICKNESS + 2, "black")
        colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, "cyan")

        // Draw bricks to canvas
        drawBricks();

        // Print mouse x and y coordinates
        var mouseBrickCol = Math.floor(mouseX / BRICK_W);
        var mouseBrickRow = Math.floor(mouseY / BRICK_H);
        var brickIndexUnderMouse = getArrayIndex(mouseBrickCol, mouseBrickRow);
        colorText("C: " + mouseBrickCol + "," + "R: " + mouseBrickRow +
                  "," + "B: " + brickIndexUnderMouse, mouseX, mouseY, "cyan")

        colorText("Lives: " + lives, 100, 30, "Black");
        colorText("Author: Kyle May", 500, 30, "Black");
}




function getArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawBricks() {
    for (var eachRow = 0; eachRow < BRICK_ROWS; ++eachRow) {
        for (var eachCol = 0; eachCol < BRICK_COLS; ++eachCol) {
            var brickArrayIndex = getArrayIndex(eachCol, eachRow);
            if (brickGrid[brickArrayIndex]) {
                colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, "black");
            } // end of is this brick here
        } // end of for each brick
    } // end of for each row of bricks
}
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}

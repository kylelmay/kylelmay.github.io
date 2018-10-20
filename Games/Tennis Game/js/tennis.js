/*jslint es6 */
/*jslint browser */
/*global window */
/*jslint devel: true */
/* jshint latedef:nofunc */

var canvas;
var canvasContext;

var ballX = 30;
var ballY = 20;
var ballSpeedX = 12;
var ballSpeedY = 4;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
var paddle1Y = 250;
var paddle2Y = 250;

var player1Score = 0;
var player2Score = 0;
const SCORE_TO_WIN = 3;

var showingWinScreen = false;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    console.log("loaded DOM");

    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener("mousemove", function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT /2 );
    });
}

function ballReset() {
    if (player1Score >= SCORE_TO_WIN || player2Score >= SCORE_TO_WIN) {
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    console.log("Ball Reset");
}
function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 7;
    } else if (paddle2YCenter > ballY - 35){
        paddle2Y -= 7;
    }
}
function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width - 20) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            console.log("Player 1 Scores");
            player1Score += 1;
            ballReset();
        }
    }
    if (ballX < 20) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            console.log("Player 2 Scores");
            player2Score += 1;
            ballReset();
        }
    }

    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 0; i < canvas.height; i+=40) {
        colorRect(canvas.width / 2 - 1, i , 2, 20, "white");
    }
}

function drawEverything() {
    // This colors the game canvas black
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    if (showingWinScreen) {
        canvasContext.fillStyle = "white";

        if (player1Score >= SCORE_TO_WIN) {
            canvasContext.fillText("Player 1 Wins!", 350, 300);
        } else {
            canvasContext.fillText("Player 2 Wins!", 350, 300);
        }
        canvasContext.fillText("Click to Continue", 350, 500);
        return;

    }
    drawNet();
    // This is the left player paddle
    colorRect(canvas.width - 790, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    // This is the right paddle
    colorRect(canvas.width - 20, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    // This draws the ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    console.log("Drawing Rectangle");
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

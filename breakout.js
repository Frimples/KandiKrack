// Set up the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const lifeLost = new Image();
lifeLost.src = "./images/ohNo.png";

const welcomeScreen = new Image();
welcomeScreen.src = "./images/welcomeText.png";

//brick images source
const brickImageYellow = new Image();
brickImageYellow.src = "./images/candy01.png";

const brickImageBlue = new Image();
brickImageBlue.src = "./images/candy02.png";

const brickImageGreen = new Image();
brickImageGreen.src = "./images/candy03.png";

const brickImagePurple = new Image();
brickImagePurple.src = "./images/candy04.png";

const brickImageRed = new Image();
brickImageRed.src = "./images/candy05.png";

const brickShadow = new Image();
brickShadow.src = "./images/brickShadow.png";

const gameOver = new Image();
gameOver.src = "./images/gameOver.jpg";

// Game variables
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 20;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 7;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;
let level = 1;
let maxLevel = 5;
let bricks = [];
let isGameRunning = false;
let tempCount = 0;
let paused = false;
let ballSpeed = 1; // You can adjust this value to control the speed of the ball
let resetDraw = 0;
let gameStarted = 0;
let ballCaptured = true;
let lastTime = Date.now();
let unpausing = 0;

// Add a variable to track the number of remaining bricks
let remainingBricks = 0;

//User Post ChatGPT Variables
let ballBitmap = new Image();
ballBitmap.src = "./images/ball.png";

let PaddleBitmap = new Image();
PaddleBitmap.src = "./images/paddle.png";

let paddleShadow = new Image();
paddleShadow.src = "./images/paddleShadow.png";

var backgroundMusic = new Audio("./sounds/background_music.mp3");
var startMusic = new Audio("./sounds/startMusic.mp3");
var brickHit = new Audio("./sounds/brickHit.mp3");
var paddleCollision = new Audio("./sounds/paddle.mp3");
var ballLostSound = new Audio("./sounds/ballLost.mp3");
var wallCollision = new Audio("./sounds/wallCollision.mp3");
var gameOverMP3 = new Audio("./sounds/gameOver.mp3");
var youWin = new Audio("./sounds/youWin.mp3");

// initial Background Setting...

canvas.style.backgroundImage = "url('./images/background00.jpg')";

// Sound placeholders

function youWinSound() {
    youWin.play();
}

function wallCollisionSound() {
    wallCollision.play();
}
function gameOverSound() {
    gameOverMP3.play();
}
function ballLost() {
    ballLostSound.play();
}

function paddleCollisionSound() {
    paddleCollision.play();
}

function playStartMusic() {
    // Add code to play background music
    startMusic.play();
}

function playCollisionSound() {
    // Add code to play sound
    brickHit.play();
}

function playBackgroundMusic() {
    // Add code to play background music
    backgroundMusic.play();
    backgroundMusic.loop = true;
}

function stopBackgroundMusic() {
    // Add code to stop background music
    backgroundMusic.pause();
}

function gameOverScreen() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(gameOver, 0, 0);
}

function lifeLostSplash() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(
        lifeLost,
        (canvas.width - lifeLost.width) / 2,
        canvas.height / 2
    );
}

//Non Media Game Functions:
// Handle mouse click events to release the ball

function mouseClickHandler(e) {
    if (ballCaptured && e.button === 0) {
        // 0 is the left mouse button
        ballCaptured = false;
    }
}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
}

// Revised Function

function initBricks() {
    bricks = [];
    remainingBricks = 0; // Reset the count for each level

    // Calculate the total width of all bricks and padding in a row
    let totalBrickWidth =
        (brickWidth + brickPadding) * brickColumnCount - brickPadding;

    // Center the bricks horizontally
    brickOffsetLeft = (canvas.width - totalBrickWidth) / 2;

    // Set the vertical offset to lower the bricks
    brickOffsetTop = canvas.height / 10; // Adjust this value to move the bricks down

    // List of possible brick images
    const brickImages = [
        brickImageYellow,
        brickImageBlue,
        brickImageGreen,
        brickImagePurple,
        brickImageRed,
    ];

    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount + level - 1; r++) {
            // Randomly select an image for each brick
            const randomImage =
                brickImages[Math.floor(Math.random() * brickImages.length)];
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1,
                image: randomImage, // Assign the selected image to the brick
            };
            remainingBricks++; // Increment the count for each brick
        }
    }
}

function increaseBallSpeed() {
    ballSpeed = ballSpeed * Math.exp(0.05);
    if (ballSpeed >= 10) {
        ballSpeed = 10;
    }
    normalizeSpeed();
}


// Background Level Change Function

function bglevelcheck() {
    if (level == 1) {
        canvas.style.backgroundImage = "url('./images/background01.jpg')";
        return;
        //drawBackground01();
    }
    if (level == 2) {
        canvas.style.backgroundImage = "url('./images/background02.jpg')";
        return;
        //drawBackground02();
    }
    if (level == 3) {
        canvas.style.backgroundImage = "url('./images/background03.jpg')";
        return;
        //drawBackground03();
    }
    if (level == 4) {
        canvas.style.backgroundImage = "url('./images/background04.jpg')";
        return;
        //drawBackground04();
    }
    if (level == 5) {
        canvas.style.backgroundImage = "url('./images/background05.jpg')";
        return;
        //drawBackground05();
    }
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.arc(x + 5, y + 5, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.closePath();
    ctx.drawImage(ballBitmap, x - ballRadius, y - ballRadius, 16, 16);
}

// Draw the paddle
function drawPaddle() {
    ctx.globalAlpha = 0.5;
    ctx.drawImage(
        paddleShadow,
        paddleX + 10,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
    );

    ctx.globalAlpha = 1.0;
    ctx.drawImage(
        PaddleBitmap,
        paddleX,
        canvas.height - paddleHeight - 10,
        paddleWidth,
        paddleHeight
    );

    //ctx.closePath();
}

//UPDATED drawBricks Function:
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount + level - 1; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.globalAlpha = 0.5;
                ctx.drawImage(
                    brickShadow,
                    brickX + 7,
                    brickY + 7,
                    brickWidth,
                    brickHeight
                );
                ctx.globalAlpha = 1.0;

                // Draw the brick using its assigned image
                ctx.drawImage(
                    bricks[c][r].image,
                    brickX,
                    brickY,
                    brickWidth,
                    brickHeight
                );
            }
        }
    }
}

function normalizeSpeed() {
    let magnitude = Math.sqrt(dx * dx + dy * dy);
    dx = (dx / magnitude) * ballSpeed;
    dy = (dy / magnitude) * ballSpeed;
}

// Draw the score
function drawScore() {
    ctx.font = "24px 'Brush Script MT'";
    ctx.fillStyle = "#5C4033";
    ctx.fillText("Score: " + score, 8, 20);
}

// Draw the lives
function drawLives() {
    ctx.font = "24px 'Brush Script MT'";
    ctx.fillStyle = "#5C4033";
    ctx.fillText("Lives: " + lives, canvas.width - 75, 20);
}

// Draw the level
function drawLevel() {
    ctx.font = "24px 'Brush Script MT'";
    ctx.fillStyle = "#5C4033";
    ctx.fillText("Level: " + level, canvas.width / 2 - 30, 20);
}

// Handle key down events
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// Handle key up events
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Handle mouse move events
function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount + level - 1; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    dx = dx < 0 ? -ballSpeed : ballSpeed; // Reset dx based on ballSpeed
                    dy = dy < 0 ? -ballSpeed : ballSpeed; // Reset dy based on ballSpeed
                    b.status = 0;
                    score++;
                    remainingBricks--; // Decrement the count when a brick is hit
                    playCollisionSound();
                    normalizeSpeed();
                    if (remainingBricks === 0) {
                        // Check if all bricks are cleared
                        if (level === maxLevel) {
                            youWinSound();
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        } else {
                            level++;
                            initBricks();
                            resetBall();
                        }
                    }
                }
            }
        }
    }
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;

    ballSpeed = 4 + level * 0.5;
    if (level == 1) {
        ballSpeed = 4;
    }
    // Normalize the speed to ensure consistency
    normalizeSpeed();
    paddleX = (canvas.width - paddleWidth) / 2;
    ballCaptured = true; // Capture the ball
    draw(); // Resume the game loop
}

function draw(timestamp) {
    // Calculate deltaTime in seconds
    let now = timestamp || Date.now();
    let deltaTime = (now - lastTime) / 1000; // Convert to seconds
    lastTime = now;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawLevel();
    collisionDetection();
    bglevelcheck();
    console.log(
        `Ball Position: (${x}, ${y}), Speed: (${dx}, ${dy}), Ball Speed: ${ballSpeed}`
    );
    // Adjust ball position based on deltaTime and speed
    x += dx * deltaTime * 60;
    y += dy * deltaTime * 60;

    // Handle ball capture
    if (ballCaptured) {
        x = paddleX + paddleWidth / 2;
        y = canvas.height - paddleHeight - ballRadius - 10;
    }

    // Wall collision detection
    let sideMargin = 15;
    if (
        x + dx > canvas.width - ballRadius - sideMargin ||
        x + dx < ballRadius + sideMargin
    ) {
        dx = -dx;
        wallCollisionSound();
        normalizeSpeed();
    }

    let topMargin = 25;
    if (y + dy < ballRadius + topMargin) {
        dy = -dy;
        wallCollisionSound();
        normalizeSpeed();
    } else if (y + dy > canvas.height - ballRadius - 15) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            let impactPoint = x - (paddleX + paddleWidth / 2);
            let angle = (impactPoint / (paddleWidth / 2)) * (Math.PI / 3); // Ball deflects up to 60 degrees
            dx = Math.sin(angle) * ballSpeed; // Use ballSpeed for dx
            dy = -Math.cos(angle) * ballSpeed; // Use ballSpeed for dy
            paddleCollisionSound();
            increaseBallSpeed();
            normalizeSpeed();
        } else {
            ballLost(); // Play ball lost sound
            lives--;
            if (!lives) {
                canvas.style.backgroundImage = "url('./images/gameOver.jpg')";
                gameOverSound();
                alert("GAME OVER");
                document.location.reload();
            } else {
                resetBall();
            }
        }
    }

    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // Request the next frame, passing the timestamp
    if (isGameRunning) {
        requestAnimationFrame(draw);
    }
}

// Start game function
function startGame() {
    isGameRunning = true;
    score = 0;
    lives = 12;
    level = 1;
    ballSpeed = 4;
    ballCaptured = true; // Ensure the ball is captured at the start
    gameStartd = 1;
    initBricks();
    playStartMusic();
    playBackgroundMusic();
    draw();
}

// Stop game function (attract mode)
function stopGame() {
    isGameRunning = false;
    stopBackgroundMusic();
}

// Event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

document.addEventListener("mousedown", mouseClickHandler, false); // New event listener for mouse clicks

document.getElementById("startButton").addEventListener("click", function () {
    if (!isGameRunning && !paused) {
        gameStarted = 1;
        event.srcElement.innerHTML = "RUNNING";
        startGame();
    }
});

// Pause Button Code
pauseButton.addEventListener("click", () => {
    if (isGameRunning) {
        isGameRunning = false;
        backgroundMusic.pause();
        paused = true;
        event.srcElement.innerHTML = "PAUSED";
    }
    if (!paused) {
        return;
    }
    if (paused) {
        isGameRunning = true;
        paused = false;
        backgroundMusic.play();
        event.srcElement.innerHTML = "PAUSE";
        unpausing = 1;
        resetBall();
    }
});

// Initialize bricks for the first level
initBricks();

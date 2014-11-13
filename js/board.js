var canvas,
    ctx,
    width = 1026,
    height = 770,
    player1_x = (width / 2) - 25,
    player1_y = height - 75,
    player1_w = 50,
    player1_h = 50;
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false;

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

function gameLoop() {
    clearCanvas();
    drawBoard();
    drawPlayer();
}

function drawBoard() {
    ctx.rect(0, 0, width, height);
    ctx.stroke();
    var imageBackground = new Image();
    imageBackground.src = './/resources/background.jpg';
    imageBackground.onload = function () {
        ctx.drawImage(imageBackground, 1, 1);
    };    
}

function drawPlayer() {
    if (rightKey) player1_x += 5;
    else if (leftKey) player1_x -= 5;
    if (upKey) player1_y -= 5;
    else if (downKey) player1_y += 5;
    if (player1_x <= 0) player1_x = 0;
    if ((player1_x + player1_w) >= width) player1_x = width - player1_w;
    if (player1_y <= 0) player1_y = 0;
    if ((player1_y + player1_h) >= height) player1_y = height - player1_h;
    ctx.fillStyle = '#f2c';
    ctx.fillRect(player1_x, player1_y, player1_w, player1_h);
}

function keyDown(e) {
    if (e.keyCode == 39) rightKey = true;
    else if (e.keyCode == 37) leftKey = true;
    if (e.keyCode == 38) upKey = true;
    else if (e.keyCode == 40) downKey = true;
}

function keyUp(e) {
    if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 37) leftKey = false;
    if (e.keyCode == 38) upKey = false;
    else if (e.keyCode == 40) downKey = false;
}

function init(e) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    //drawBoard();
    setInterval(gameLoop, 25);


    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
}

window.onload = init;
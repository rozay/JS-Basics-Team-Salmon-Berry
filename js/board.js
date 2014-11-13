function init(e) {
    setInterval(gameLoop, 1000 / 60);
    canvas.canvasElement.width = canvas.width;
    canvas.canvasElement.height = canvas.height;
    canvas.canvasContext = canvas.canvasElement.getContext('2d');
    canvas.background.src = 'resources/background.jpg';
    
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
}

window.onload = init;

var canvas = {
        canvasElement : document.getElementById('canvas'),
        canvasContext : undefined,
        width : 1024,
        height: 768,
        background : new Image()
    }
var player = {
    positionX : 0,
    positionY : 0,
    width : 50,
    height : 50,
    movingRight : false,
    movingLeft : false,
    movingUp : false,
    movingDown : false,
    speed : 3,
    draw : function() {
        canvas.canvasContext.fillStyle = "#f0f";
        canvas.canvasContext.fillRect(this.positionX,this.positionY, this.width, this.height);
    }
}

function drawEverything() {
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.canvasContext.drawImage(canvas.background, 0, 0);
    player.draw();
}

function update() {
    if(player.movingLeft === true)
        player.positionX -= player.speed;
    else if(player.movingRight === true)
        player.positionX += player.speed;
    if(player.movingUp === true)
        player.positionY -= player.speed;
    else if(player.movingDown === true)
        player.positionY += player.speed;
    outOfBoundsCheck();
}

function outOfBoundsCheck() {
    if(player.positionX < 0)
        player.positionX = 0;
    else if(player.positionX + player.width > canvas.width)
        player.positionX = canvas.width - player.width;
    if(player.positionY < 0)
        player.positionY = 0;
    else if(player.positionY + player.height > canvas.height)
        player.positionY = canvas.height - player.height;
}

function gameLoop() {
    update();
    drawEverything();
}

function keyDown(event) {
    if (event.keyCode == 39)
        player.movingRight = true;
    else if (event.keyCode == 37)
        player.movingLeft = true;
    if (event.keyCode == 38)
        player.movingUp = true;
    else if (event.keyCode == 40)
        player.movingDown = true;
}

function keyUp(e) {
    if (event.keyCode == 39)
        player.movingRight = false;
    else if (event.keyCode == 37)
        player.movingLeft = false;
    if (event.keyCode == 38)
        player.movingUp = false;
    else if (event.keyCode == 40)
        player.movingDown = false;
}
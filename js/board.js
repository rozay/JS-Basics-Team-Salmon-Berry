function init(e) {
    startGame();
    setInterval(gameLoop, 1000 / 60);
    canvas.canvasElement.width = canvas.width;
    canvas.canvasElement.height = canvas.height;
    canvas.canvasContext = canvas.canvasElement.getContext('2d');
    canvas.background.src = 'resources/background.jpg';
    player.playerImage.src = 'resources/player.png';
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
}

window.onload = init;
var enemyImages = [];
var enemyBulletImage;

var canvas = {
        canvasElement : document.getElementById('canvas'),
        canvasContext : undefined,
        width : 1024,
        height: 620,
        background : new Image()
    }
var player = {
    positionX : 0,
    positionY : 0,
    width : 40,
    height : 65,
    playerImage : new Image(),
    movingRight : false,
    movingLeft : false,
    movingUp : false,
    movingDown : false,
    speed : 3,
    health : 100,
    bullets : [],
    draw : function() {
        canvas.canvasContext.drawImage(player.playerImage, player.positionX, player.positionY);
    }
}

function createEnemy()
{
    var  tempEnemy = {
        hitPoint : Math.round(Math.random() * 10) + 5,
        bullets : [],
        positionX : 0,
        positionY : 0,
        width : 0,
        height : 0,
        typeEnemy : 0,
        draw : function()
        {
            canvas.canvasContext.drawImage(enemyImages[this.typeEnemy], this.positionX, this.positionY);
        },
        update : function()
        {
            
        }
    }
    return tempEnemy;
}

function createBullet()
{
    var tempBullet = {
        hitPoint : 0,
        positionX : 0,
        positionY : 0,
        width : 0,
        height : 0
    }
    return tempBullet;
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

function startGame() {
    player.level = 1;
    player.score = 0;
    player.positionX = canvas.width / 2 - player.width / 2;
    player.positionY = canvas.height - player.height;   
}
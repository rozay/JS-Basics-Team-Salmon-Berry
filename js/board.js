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

var gamePlay = {
    level: 1,
    enemiesPerLevel: 20,
    enemies: 10
}

var player = {
    positionX : 0,
    positionY : 0,
    width : 65,
    height : 40,
    playerImage: new Image(),
    movingRight : false,
    movingLeft : false,
    movingUp : false,
    movingDown : false,
    speed : 3,
    health: 100,
    lives: 3,
    bullets : [],
    draw : function() {
        canvas.canvasContext.drawImage(player.playerImage, this.positionX, this.positionY);
    }
}

var enemies = {}

function createEnemy()
{
    var enemy = {
        hitPoint: Math.round(Math.random() * 10) + 5,
        bullets: [],
        width: 65,
        height: 40,
        positionX: canvas.width + 80,
        positionY: Math.round(Math.random() * canvas.height) - 40,
        speed: Math.random() + gamePlay.level,      
        enemyImage: new Image(),
        typeEnemy: 0,
        draw: function () {
            canvas.canvasContext.drawImage(this.enemyImage, this.positionX, this.positionY);
            this.update();
        },
        update: function () {
            this.positionX = this.positionX - this.speed;
            this.positionY = this.positionY; //+ Math.round(Math.random() * 2) - Math.round(Math.random() * 2);

            
            this.outOfBounds();
        },
        outOfBounds: function () {
            if (this.positionY < 0)
                this.positionY = 0;
            else if (this.positionY > canvas.heigt - this.height)
                this.positionY = canvas.height - this.height;
            if (this.positionX < 0 - this.width) {
                this.positionY = Math.round(Math.random() * canvas.height);
                this.positionX = canvas.width + 80;
            }
        }
    }
    return enemy;
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

    for (var i = 0; i < gamePlay.enemies; i++) {
        enemies['enemy' + (i + 1)].draw();     
    }
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
    else if (player.positionX > canvas.width - player.width)
        player.positionX = canvas.width - player.width;
    if (player.positionY < 0 - player.height)
        player.positionY = canvas.height - player.height;
    else if (player.positionY > canvas.height)       
        player.positionY = 0;
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

    if (player.lives === 0) {
        gamePlay.level = 1;
        player.score = 0;
    }

    gamePlay.enemies = gamePlay.enemiesPerLevel * gamePlay.level;
    player.positionX = 0;
    player.positionY = canvas.height / 2 - player.height / 2;

    for (var i = 0; i < gamePlay.enemies; i++) {
        enemies['enemy' + (i + 1)] = createEnemy();
        enemies['enemy' + (i + 1)].enemyImage.src = 'resources/enemy.png';
    }
}
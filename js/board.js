function init(e) {
    loadResources();
    startGame();
    canvas.canvasElement.width = canvas.width;
    canvas.canvasElement.height = canvas.height;
    canvas.canvasContext = canvas.canvasElement.getContext('2d');
    canvas.background.src = 'resources/bg/background.jpg';
    player.playerImage.src = 'resources/player/main.png';
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    setInterval(gameLoop, 1000 / 60);
}

window.onload = init;
var enemyImages = [];
var enemyBulletImage;

function loadResources()
{
    for(var i = 1; i <= 4;i++)
    {
        var tempImage = new Image();
        tempImage.src = 'resources/enemies/enemy' + i.toString() + '.png';
        enemyImages.push(tempImage);
    }
}

var canvas = {
        canvasElement : document.getElementById('canvas'),
        canvasContext : undefined,
        width : 1024,
        height: 620,
        background : new Image()
}

var Game = {
    level: 1,
    enemiesPerLevel: 20,
    enemies: [],
    handleCollisions : function()
    {
        for(var i = 0; i < this.enemies.length;i++)
        {
            
        }
    }
}

var player = {
    positionX : 0,
    positionY : 0,
    width : 75,
    height : 60,
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
        speed: Math.random() + Game.level,      
        typeEnemy: Math.round(Math.random() * 3),
        draw: function () {
            canvas.canvasContext.drawImage(enemyImages[this.typeEnemy], this.positionX, this.positionY);
        },
        update: function () {
            this.positionX = this.positionX - this.speed;
            this.positionY = this.positionY; //+ Math.round(Math.random() * 2) - Math.round(Math.random() * 2);   
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
    
    for (var i = 0; i < Game.enemies.length; i++) {
        Game.enemies[i].draw();     
    }
    
    player.draw();
}

function update() {
    if(player.movingLeft === true) {
        player.positionX -= player.speed;
    }
    else if(player.movingRight === true) {
        player.positionX += player.speed;
    }
    if(player.movingUp === true) {
        player.positionY -= player.speed;
    }
    else if(player.movingDown === true) {
        player.positionY += player.speed;
    }
    outOfBoundsCheck();
    for(var i = 0; i < Game.enemies.length;i++)
        Game.enemies[i].update();
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
    if (event.keyCode == 39){
        player.movingRight = true;
        player.playerImage.src = 'resources/player/redForward.png';
    }
    else if (event.keyCode == 37){
        player.movingLeft = true;
        player.playerImage.src = 'resources/player/redBackwards.png';
    }
    if (event.keyCode == 38){
        player.movingUp = true;
        player.playerImage.src = 'resources/player/redLeft.png';
    }
    else if (event.keyCode == 40){
        player.movingDown = true;
        player.playerImage.src = 'resources/player/redRight.png';
    }
}

function keyUp(e) {
    if (event.keyCode == 39){
        player.movingRight = false;
        player.playerImage.src = 'resources/player/main.png';
    }
    else if (event.keyCode == 37){
        player.movingLeft = false;
        player.playerImage.src = 'resources/player/main.png';
    }
    if (event.keyCode == 38){
        player.movingUp = false;
        player.playerImage.src = 'resources/player/main.png';
    }
    else if (event.keyCode == 40){
        player.movingDown = false;
        player.playerImage.src = 'resources/player/main.png';
    }
}

function startGame() {

    if (player.lives === 0) {
        Game.level = 1;
        player.score = 0;
    }

    
    player.positionX = 0;
    player.positionY = canvas.height / 2 - player.height / 2;

    for (var i = 0; i < Game.enemiesPerLevel; i++) {
        Game.enemies.push(createEnemy());
    }
}
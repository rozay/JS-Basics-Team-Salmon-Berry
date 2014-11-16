window.onload = init;
var enemyImages = [];
var bulletImages = [];
var bonusImages = [];
var bgMusic = new Audio("resources/sounds/backgroundMusic.mp3");
var bulletSound = new Audio("resources/sounds/PlayerBullet.mp3");
bgMusic.play();
bgMusic.volume = 0.2;
bgMusic.loop = true;

var canvas = {
    canvasElement : document.getElementById('canvas'),
    canvasContext : undefined,
    width : 1024,
    height: 620,
    background : new Image(),
    starsLayer : new Image(),
    starsOneX : 0,
    starsTwoX : 1024,
    updateStars : function()
    {
        this.starsOneX -= 2;
        this.starsTwoX -= 2;
        if(this.starsOneX <= -this.width)
            this.starsOneX = this.width;
        else if(this.starsTwoX  <= -this.width)
            this.starsTwoX = this.width;
    }
}

var Game = {
    level : 1,
    enemiesPerLevel: 20,
    gameOver: false,
    enemies : [],
    bullets : [],
    bonuses : [],
    handleCollisions : function()
    {
        for(var i = 0; i < this.enemies.length;i++)
        {
            for(var j = 0; j < this.bullets.length;j++)
            {
                if(this.bullets[j].owner === 'player' && this.bullets[j].positionX + this.bullets[j].width >= this.enemies[i].positionX &&
                  this.bullets[j].positionX <= this.enemies[i].positionX + this.enemies[i].width &&
                  this.bullets[j].positionY + this.bullets[j].height >= this.enemies[i].positionY &&
                  this.bullets[j].positionY <= this.enemies[i].positionY + this.enemies[i].height)
                {
                    if(this.enemies[i].chanceForBonus >= 0 && this.enemies[i].chanceForBonus <= 10)
                        this.bonuses.push(new Bonus(this.enemies[i].positionX,this.enemies[i].positionY));
                    this.enemies.splice(i, 1);
                    this.bullets.splice(j, 1);
                    player.score += Game.level * 10;
                    break;
                }
                else if(this.bullets[j].owner === 'enemy' && this.bullets[j].positionX + this.bullets[j].width >= player.positionX &&
                  this.bullets[j].positionX <= player.positionX + player.width &&
                  this.bullets[j].positionY + this.bullets[j].height >= player.positionY &&
                  this.bullets[j].positionY <= player.positionY + player.height)
                {                    
                    this.bullets.splice(j, 1);
                    player.health -= this.bullets[j].hitPoint;
                    if (player.health <= 0) {
                        player.lives--;
                        checkLives();
                    }
                }
                
                if (this.bullets.length != 0) {
                    if (this.bullets[j].positionX > canvas.width
                  || this.bullets[j].positionX < 0) {
                        this.bullets.splice(j, 1);
                    }
                }               
            }           
        }
        //Enemy collision
        for(var i = 0; i < this.enemies.length;i++)
        {
            if(this.enemies[i].positionX + this.enemies[i].width >= player.positionX &&
              this.enemies[i].positionX <= player.positionX + player.width &&
              this.enemies[i].positionY + this.enemies[i].height >= player.positionY &&
              this.enemies[i].positionY <= player.positionY + player.height)
            {
                player.lives -= 1;
                checkLives();
            }
            else
            {
                if(Math.round(Math.random() * 100) === 99)
                {
                    Game.bullets.push(new Bullet('enemy', this.enemies[i].hitPoint, -3,
                            2, this.enemies[i].positionX, 
                            this.enemies[i].positionY + this.enemies[i].height / 4));
                }
            }
        }
        
        for(var i = 0; i < this.bonuses.length;i++)
        {
            if(this.bonuses[i].positionX + this.bonuses[i].width >= player.positionX &&
                  this.bonuses[i].positionX <= player.positionX + player.width &&
                  this.bonuses[i].positionY + this.bonuses[i].height >= player.positionY &&
                  this.bonuses[i].positionY <= player.positionY + player.height)
            {
                if(this.bonuses[i].typeBonus == 0){
                    player.doubleGuns = true;
                    player.doubleGunsTime = 10;
                }
                if (this.bonuses[i].typeBonus == 1) {
                    player.health=100;
                }
                this.bonuses.splice(i,1);
            }
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
    doubleGuns : false,
    doubleGunsTime : 10,
    score: 0,
    draw : function() {
        for(var i in this.bullets)
            this.bullets[i].draw();
        canvas.canvasContext.drawImage(player.playerImage, this.positionX, this.positionY);        
    },
    outOfBoundsCheck : function() {
        if(this.positionX < 0)
            this.positionX = 0;
        else if (this.positionX > canvas.width - this.width)
            this.positionX = canvas.width - this.width;
        if (this.positionY < 0 - this.height)
            this.positionY = canvas.height - this.height;
        else if (this.positionY > canvas.height)       
            this.positionY = 0;
    },
    update : function() {
        if(this.movingLeft === true) {
            this.positionX -= this.speed;
        }
        else if(this.movingRight === true) {
            this.positionX += this.speed;
        }
        if(this.movingUp === true) {
            this.positionY -= this.speed;
        }
        else if(this.movingDown === true) {
            this.positionY += this.speed;
        }     
        if(this.doubleGuns === true)
        {
            this.doubleGunsTime -= 0.03;
            if(this.doubleGunsTime <= 0)
            {
                this.doubleGuns = false;
                this.doubleGunsTime = 0;
            }
        }
        this.outOfBoundsCheck()
    }
}

function init(e) {
    loadResources();
    startGame();
    canvas.canvasElement.width = canvas.width;
    canvas.canvasElement.height = canvas.height;
    canvas.canvasContext = canvas.canvasElement.getContext('2d');
    canvas.background.src = 'resources/bg/shining.png';
    canvas.starsLayer.src = 'resources/bg/stars.png';
    player.playerImage.src = 'resources/player/main.png';
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    setInterval(gameLoop, 1000 / 60);
}

function loadResources()

{
    for(var i = 1; i <= 4;i++)
    {
        var tempImage = new Image();
        tempImage.src = 'resources/enemy.png';
        enemyImages.push(tempImage);
    }

    var enemyBullet = new Image();
    var playerBullet = new Image();
    var doubleBullet = new Image();
    var bulletsBonus = new Image();
    var repairBonus = new Image();
    
    bulletsBonus.src = 'resources/bonuses/bullets.png';
    repairBonus.src = 'resources/bonuses/repairBonus.png';
    enemyBullet.src = 'resources/bullet-enemies.png';
    playerBullet.src = 'resources/bullet.png';
    doubleBullet.src = 'resources/bullet-double.png';
    bulletImages.push(playerBullet);
    bulletImages.push(doubleBullet);
    bulletImages.push(enemyBullet);  
    bonusImages.push(bulletsBonus);
    bonusImages.push(repairBonus);
}

function startGame() {

    if (player.lives === 0) {
        Game.level = 1;
        player.score = 0;
    }

    player.positionX = 0;
    player.positionY = canvas.height / 2 - player.height / 2;

    for (var i = 0; i < Game.enemiesPerLevel; i++) {
        Game.enemies.push(new Enemy());
    }
}

function gameLoop() {
    update();
    drawEverything();

    if (player.lives == 0) {
        Game.gameOver = true;
    } 
}

function update() {
    canvas.updateStars();

    if (!Game.gameOver) {
        player.update();
        for (var i = 0; i < Game.bullets.length; i++)
            Game.bullets[i].update();
        for (var i = 0; i < Game.enemies.length; i++)
            Game.enemies[i].update();
        for (var i = 0; i < Game.bonuses.length; i++) {
            Game.bonuses[i].update();
            if (Game.bonuses[i].checkTime()) {
                Game.bonuses.splice(i, 1);
            }
        }
        Game.handleCollisions();
    }
}

function drawEverything() {
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.canvasContext.drawImage(canvas.background, 0, 0);
    canvas.canvasContext.drawImage(canvas.starsLayer,canvas.starsOneX,0);
    canvas.canvasContext.drawImage(canvas.starsLayer, canvas.starsTwoX, 0);
    if (!Game.gameOver) {
        drawGUI();
        for (var i = 0; i < Game.enemies.length; i++) {
            Game.enemies[i].draw();
        }
        for (var i = 0; i < Game.bonuses.length; i++) {
            Game.bonuses[i].draw();
        }
        for (var i = 0; i < Game.bullets.length; i++)
            Game.bullets[i].draw();
        player.draw();
    } else {
        gameOver();
    }
}

function Enemy()
{
    this.hitPoint = Math.round(Math.random() * 10) + 5;
    this.width = 50;
    this.height = 50;
    this.positionX = canvas.width + Math.round(Math.random() * canvas.width * 2);
    this.positionY = Math.round(Math.random() * (canvas.height - 40));
    this.speed = Math.random() + Game.level;
    this.typeEnemy = Math.round(Math.random() * 3);
    this.chanceForBonus = Math.round(Math.random() * 80);
    this.draw = function () 
    {
        canvas.canvasContext.drawImage(enemyImages[this.typeEnemy], this.positionX, this.positionY);
    };
    this.update = function () 
    {
        this.positionX = this.positionX - this.speed;
        this.positionY = this.positionY; //+ Math.round(Math.random() * 2) - Math.round(Math.random() * 2); 
        this.outOfBoundsCheck()
    };
    this.outOfBoundsCheck = function () 
    {
        if (this.positionX < 0 - this.width)
            this.positionX = canvas.width + Math.round(Math.random() * canvas.width * 2);
    };
}

function Bullet(ownerTag, hitPointValue, speedToApply, bulletType, posX, posY)
{
    this.hitPoint = hitPointValue;
    this.positionX = posX;
    this.positionY = posY;
    this.width = 0;
    this.height = 0;
    this.speed = speedToApply;
    this.owner = ownerTag;
    this.typeBullet = bulletType;
    this.update = function()
    {
        this.positionX += this.speed; 
    };
    this.outOfBoundsCheck = function()
    {
        if(this.positionX > canvas.width || this.positionX < 0)
            return true;
        else
            return false;
    };
    this.draw = function()
    {
        canvas.canvasContext.drawImage(bulletImages[this.typeBullet], this.positionX, this.positionY);
    };
}

function Bonus(posX, posY)
{
    this.width  = 60;
    this.height = 40;
    this.positionX = posX;
    this.positionY = posY;
    this.typeBonus = Math.round(Math.random()*1);
    this.disappearTime = 10;
    this.draw = function () 
    {
        canvas.canvasContext.drawImage(bonusImages[this.typeBonus], this.positionX, this.positionY);
    };
    this.update = function()
    {
        this.disappearTime-=0.01;
    };
    this.checkTime = function()
    {
        if (this.disappearTime <= 0) {
            return true;
        }
        else{
            return false;
        }
    };
}

function keyDown(event) {
    if (event.keyCode == 39){
        player.movingRight = true;
        player.playerImage.src = 'resources/player/forward.png';
    }
    else if (event.keyCode == 37){
        player.movingLeft = true;
        player.playerImage.src = 'resources/player/back.png';
    }
    if (event.keyCode == 38){
        player.movingUp = true;
        player.playerImage.src = 'resources/player/left.png';
    }
    else if (event.keyCode == 40){
        player.movingDown = true;
        player.playerImage.src = 'resources/player/right.png';
    }
   
    if(event.keyCode == 88)
    {
        bulletSound.play();
        if(player.doubleGuns === true){
            Game.bullets.push(new Bullet('player', 10, player.speed, 
                        0, player.positionX + player.width, player.positionY));
            Game.bullets.push(new Bullet('player', 10, player.speed,
                        0, player.positionX + player.width, player.positionY + player.height - 10));
        }
        else{
            Game.bullets.push(new Bullet('player', 10, player.speed,
                        0, player.positionX + player.width, 
                        player.positionY + player.health / 4));
        }
    }
}

function keyUp(event) {
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

function checkLives() {
    if (player.lives > 0) {
        reset();
    }
}

function reset() {
    player.positionX = 0;
    player.positionY = canvas.height / 2 - player.height / 2;
    Game.bullets = [];
    player.health = 100;
}

function drawGUI() {
    canvas.canvasContext.font = 'bold 20px Arial';
    canvas.canvasContext.fillStyle = '#fff';
    canvas.canvasContext.fillText('Lives:  ' + player.lives, 10, 30);
    canvas.canvasContext.fillText('Score:   ' + player.score, 10, 50);
    canvas.canvasContext.strokeStyle = '#fff';
    canvas.canvasContext.lineWidth = 3;
    canvas.canvasContext.strokeRect(5,canvas.height - 45, 106, 36);
    canvas.canvasContext.fillStyle = '#0f0';
    canvas.canvasContext.fillRect(8,canvas.height - 42, player.health, 30);
}

function gameOver() {
    canvas.canvasContext.font = 'bold 20px Arial';
    canvas.canvasContext.fillStyle = '#fff';
    canvas.canvasContext.fillText('GAME OVER!', canvas.width / 2 - 90, canvas.height / 2);
}
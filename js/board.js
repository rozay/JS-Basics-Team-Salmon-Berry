window.onload = init;
var enemyImages = [];
var bulletImages = [];
var bonusImages = [];
var doubleGun = 0;
var gunBonusHitted = false;
var bgMusic = new Audio("resources/sounds/backgroundMusic.mp3");
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
    enemiesPerLevel : 20,
    enemies : [],
    bullets : [],
    bonuses : [],
    handleCollisions : function()
    {
        for(var i = 0; i < this.enemies.length;i++)
        {
            for(var j = 0; j < this.bullets.length;j++)
            {
                if(this.bullets[j].positionX + this.bullets[j].width >= this.enemies[i].positionX &&
                  this.bullets[j].positionX <= this.enemies[i].positionX + this.enemies[i].width &&
                  this.bullets[j].positionY + this.bullets[j].height >= this.enemies[i].positionY &&
                  this.bullets[j].positionY <= this.enemies[i].positionY + this.enemies[i].height)
                {
                    if(this.enemies[i].chanceForBonus >= 0 && this.enemies[i].chanceForBonus <= 10)
                        this.bonuses.push(createBonus(this.enemies[i].positionX,this.enemies[i].positionY));
                    this.enemies.splice(i, 1);
                    this.bullets.splice(j, 1);
                    break;
                }
                if(this.bullets[j].positionX > canvas.width
                  || this.bullets[j].positionX < 0)
                {
                    this.bullets.splice(j, 1);
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
                    gunBonusHitted = true;
                    doubleGun = 10;
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
        tempImage.src = 'resources/enemies/enemy' + i.toString() + '.png';
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
    playerBullet.src = 'resources/bullet-single.png';
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
        Game.enemies.push(createEnemy());
    }
}

function gameLoop() {
    if (player.lives > 0) {
        update();
        drawEverything();
    } else {
        canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function update() {
    canvas.updateStars();
    player.update();
    for(var i = 0; i< Game.bullets.length;i++)
        Game.bullets[i].update();
    for(var i = 0; i < Game.enemies.length;i++)
        Game.enemies[i].update();
    for (var i = 0; i < Game.bonuses.length; i++) {
        Game.bonuses[i].update();
        if (Game.bonuses[i].checkTime()) {
            Game.bonuses.splice(i,1);
        }
    }
    doubleGun-=0.04;
    if (doubleGun<=0) {
        gunBonusHitted=false;
    }
    Game.handleCollisions();
    shipCollision();
}

function drawEverything() {
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.canvasContext.drawImage(canvas.background, 0, 0);
    canvas.canvasContext.drawImage(canvas.starsLayer,canvas.starsOneX,0);
    canvas.canvasContext.drawImage(canvas.starsLayer,canvas.starsTwoX,0);
    for (var i = 0; i < Game.enemies.length; i++) {
        Game.enemies[i].draw();     
    }
    for (var i = 0; i < Game.bonuses.length; i++) {
        Game.bonuses[i].draw();
    }
    for(var i = 0; i< Game.bullets.length;i++)
        Game.bullets[i].draw();
    player.draw();
}

function createEnemy()
{
    var enemy = {
        hitPoint: Math.round(Math.random() * 10) + 5,
        width: 60,
        height: 40,
        positionX: canvas.width + Math.round(Math.random() * canvas.width * 2),
        positionY: Math.round(Math.random() * (canvas.height - 40)),
        speed: Math.random() + Game.level,      
        typeEnemy: Math.round(Math.random() * 3),
        chanceForBonus : Math.round(Math.random() * 100),
        draw: function () {
            canvas.canvasContext.drawImage(enemyImages[this.typeEnemy], this.positionX, this.positionY);
        },
        update: function () {
            this.positionX = this.positionX - this.speed;
            this.positionY = this.positionY; //+ Math.round(Math.random() * 2) - Math.round(Math.random() * 2); 
            this.outOfBoundsCheck()
        },
        outOfBoundsCheck: function () {
            if (this.positionX < 0 - this.width)
                this.positionX = canvas.width + Math.round(Math.random() * canvas.width * 2);
        }
    }
    return enemy;
}

function createBullet(ownerTag, hitPointValue, speedToApply, bulletType)
{
    var tempBullet = {
        hitPoint : hitPointValue,
        positionX : player.positionX + player.width,
        positionY : player.positionY + player.height / 4,
        width : 0,
        height : 0,
        speed : speedToApply,
        owner : ownerTag,
        typeBullet : bulletType,
        update : function()
        {
            this.positionX += this.speed; 
        },
        outOfBoundsCheck : function()
        {
            if(this.positionX > canvas.width || this.positionX < 0)
                return true;
            else
                return false;
        },
        draw : function()
        {
            canvas.canvasContext.drawImage(bulletImages[this.typeBullet], this.positionX, this.positionY);
        }

    }
    return tempBullet;

}

function createBonus(posX, posY)
{
    var bonus = {
        width: 60,
        height: 40,
        positionX: posX,
        positionY: posY,
        typeBonus: Math.round(Math.random()*1),
        disappearTime: 10,
        draw : function () {
            canvas.canvasContext.drawImage(bonusImages[this.typeBonus], this.positionX, this.positionY);
        },
        update: function(){
            this.disappearTime-=0.05;
            this.doubleGun-=0.05;
        },
        checkTime: function(){
            if (this.disappearTime <= 0) {
                return true;
            }
            else{
                return false;
            }
        }

    };

    return bonus;

}
function keyDown(event) {
    if (event.keyCode == 39){
        player.movingRight = true;
        player.playerImage.src = 'resources/player/redForward.png';
        bulletSound.play();
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
   

    if(event.keyCode == 88)
    {
        var bulletSound = new Audio("resources/sounds/PlayerBullet.mp3");
        bulletSound.play();
        if(gunBonusHitted){
            Game.bullets.push(createBullet('player',10,player.speed,1));
        }
        else{
            Game.bullets.push(createBullet('player',10,player.speed,0));
        }


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





// *************************************************
// *************************************************
// *************************************************
function shipCollision() {

    for (var i = 0; i < Game.enemies.length; i++) {
        if (player.positionX + player.width > Game.enemies[i].positionX && player.positionX < Game.enemies[i].positionX + Game.enemies[i].width) {
            checkLives();
        }
    }
}

function checkLives() {
    player.lives -= 1;
    if (player.lives > 0) {
        reset();
    }
}

function reset() {
    player.positionX = 0;
    player.positionY = canvas.height - player.height / 2;
}

function scoreTotal() {
    canvas.canvasContext.font = 'bold 20px Georgia';
    canvas.canvasContext.fillStyle = '#000';
    canvas.canvasContext.fillText('Lives:', 10, 30);
    canvas.canvasContext.fillText(player.lives, 68, 30);
}
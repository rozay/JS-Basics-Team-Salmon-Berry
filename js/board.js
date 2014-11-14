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

window.onload = init;
var enemyImages = [];
var bulletImages = [];
var bonusImaages = [];

function loadResources()
{
    for(var i = 1; i <= 4;i++)
    {
        var tempImage = new Image();
        tempImage.src = 'resources/enemies/enemy' + i.toString() + '.png';
        enemyImages.push(tempImage);
    }
    var enemyBullet = playerBullet = doubleBullet = new Image();
    enemyBullet.src = 'resources/bullet-enemies.png';
    playerBullet.src = 'resources/bullet-single.png';
    doubleBullet.src = 'resources/bullet-double.png';
    bulletImages.push(playerBullet);
    bulletImages.push(doubleBullet);
    bulletImages.push(enemyBullet);
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
    },
    bonuses:[]
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
            this.positionY = canvas.height - player.this;
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
        for(var i in this.bullets)
        {
            this.bullets[i].update();
            if(this.bullets[i].outOfBoundsCheck())
                this.bullets.splice(i,1);
        }
    }
}

var enemies = {}

function createEnemy()
{
    var enemy = {
        hitPoint: Math.round(Math.random() * 10) + 5,
        bullets: [],
        width: 60,
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
        positionX : player.positionX + player.width,
        positionY : player.positionY + player.height / 2,
        width : 0,
        height : 0,
        speed : 10,
        owner : 'player',
        typeBullet : 0,
        update : function()
        {
            this.positionX += this.speed; 
        },
        outOfBoundsCheck : function()
        {
            if(this.positionX > canvas.width)
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
function createBonus()
{
    var bonus = {
        bullets: [],
        width: 60,
        height: 40,
        positionX: 0,
        positionY: 0,
        typeBonus: Math.round(Math.random()*1),
        disappearTime: 10,
        draw: function () {
            canvas.canvasContext.drawImage(bonusImages[this.typeEnemy], this.positionX, this.positionY);
        },
        update: function(){
            this.disappearTime-=0.5;

        },
        checkTime: function(){
            if (this.disappearTime<=0) {
                return true;
            }
            else{
                return false;
            }
        }
    };
    return bonus;
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
    player.draw();
}

function update() {
    canvas.updateStars();
    player.update();
    for(var i = 0; i < Game.enemies.length;i++)
        Game.enemies[i].update();
    for (var i = 0; i < Game.bonuses.length; i++) {
        Game.bonuses[i].update();
        if (Game.bonuses[i].checkTime()) {
            Game.bonuses[i].splice(i,1);
        }
    }
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
    
    if(event.keyCode == 32)
    {
        player.bullets.push(createBullet());
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
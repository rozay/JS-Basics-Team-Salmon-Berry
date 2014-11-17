window.onload = init;
var enemyImages = [];
var bulletImages = [];
var bonusImages = [];
var explosionEffect = [];
var bgMusic = new Audio("resources/sounds/backgroundMusic.mp3");
var bulletSound = new Audio("resources/sounds/PlayerBullet.mp3");
var menuScreenImages = [];
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
    gameStarted: false,
    enemies : [],
    bullets : [],
    bonuses : [],
    explosions : [],
    handleCollisions : function()
    {
        for(var i = 0; i < this.enemies.length;i++)
        {
            for(var j = 0; j < this.bullets.length;j++)
            {
                if(this.bullets[j].owner === 'player' && areColliding(this.bullets[j], this.enemies[i]) === true)
                {
                    if(this.enemies[i].chanceForBonus >= 0 && this.enemies[i].chanceForBonus <= 10)
                        this.bonuses.push(new Bonus(this.enemies[i].positionX,this.enemies[i].positionY));
                    this.explosions.push(new Explosion(this.enemies[i].positionX - 200,this.enemies[i].positionY - 200));
                    this.enemies.splice(i, 1);
                    this.bullets.splice(j, 1);
                    player.score += Game.level * 10;
                    break;
                }
                else if(this.bullets[j].owner === 'enemy' && areColliding(this.bullets[j], player) === true)
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
            if(areColliding(this.enemies[i],player) === true)
            {
                player.lives -= 1;
                 this.explosions.push(new Explosion(this.enemies[i].positionX - 200,this.enemies[i].positionY - 200));
                this.enemies.splice(i,1);
                checkLives();
            }
            else
            {
                if(Math.round(Math.random() * 100) === 99)
                {
                    Game.bullets.push(new Bullet('enemy', this.enemies[i].hitPoint, -3,
                            1, this.enemies[i].positionX, 
                            this.enemies[i].positionY + this.enemies[i].height / 4));
                }
            }
        }
        
        for(var i = 0; i < this.bonuses.length;i++)
        {
            if(areColliding(this.bonuses[i], player) === true)
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

var Menu = 
{
    active: true,
    buttons : [new Button('play',50), new Button('credits', 227), new Button('exit',394)],
    draw : function()
    {
        for(var i in this.buttons)
        {
            canvas.canvasContext.drawImage(menuScreenImages[this.buttons[i].name][this.buttons[i].version],
                                          this.buttons[i].positionX, this.buttons[i].positionY,
                                          this.buttons[i].width, this.buttons[i].height);
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
    //startGame();
    canvas.canvasElement.width = canvas.width;
    canvas.canvasElement.height = canvas.height;
    canvas.canvasContext = canvas.canvasElement.getContext('2d');
    canvas.background.src = 'resources/bg/shining.png';
    canvas.starsLayer.src = 'resources/bg/stars.png';
    player.playerImage.src = 'resources/player/main.png';
    
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    document.addEventListener("mousemove", mouseOver);
    document.addEventListener("click", mouseClick);
    setInterval(gameLoop, 1000 / 60);
}

function mouseClick(event)
{
    var temp = { 'positionX': event.clientX - canvas.canvasElement.offsetLeft, 'positionY': event.clientY - canvas.canvasElement.offsetTop, 'width': 1, 'height': 1 };

    if (Menu.active) {
        for (var i in Menu.buttons) {
            if (areColliding(temp, Menu.buttons[i]) && Menu.buttons[i].name === 'play') {
                Game.gameOver = false;
                Game.gameStarted = true;
                Menu.active = false;
                startGame();
            }
            else {
                Menu.buttons[i].width = 167;
            }
        }
    } else if (Game.gameOver) {
        Menu.active = true;
        Game.gameOver = false;
    }
    
}

function mouseOver(event)
{
    var temp = {'positionX' : event.clientX - canvas.canvasElement.offsetLeft, 'positionY' : event.clientY - canvas.canvasElement.offsetTop, 'width' : 1, 'height' : 1};
    for(var i in Menu.buttons)
    {
        if(areColliding(temp, Menu.buttons[i]))
        {
            Menu.buttons[i].version = 1;
        }
        else
        {
            Menu.buttons[i].version = 0;
        }
    }
}

function loadResources()

{
    for(var i = 1; i <= 4;i++)
    {
        enemyImages.push(createImage('resources/enemy.png'));
    }
    
    for(var i = 1; i <= 10; i++)
    {
        explosionEffect.push(createImage('resources/Effects/Explosion/Explosion_' + i + '.png'));
    }
    
    menuScreenImages['play'] = [createImage('resources/Menu/Play.png'), createImage('resources/Menu/Play-hover.png')];
    menuScreenImages['credits'] = [createImage('resources/Menu/Credits.png'), createImage('resources/Menu/Credits-hover.png')];
    menuScreenImages['exit'] = [createImage('resources/Menu/Exit.png'),createImage('resources/Menu/Exit-hover.png')];
    
    bulletImages.push(createImage('resources/bullet.png'));
    bulletImages.push(createImage('resources/bullet-enemies.png'));  
    bonusImages.push(createImage('resources/bonuses/bullets.png'));
    bonusImages.push(createImage('resources/bonuses/repairBonus.png'));
}

function startGame() {

    if (player.lives === 0) {       
        Game.level = 1;
        player.score = 0;
        player.lives = 3;
        Game.enemies = [];
        reset();
    }

    player.positionX = 0;
    player.positionY = canvas.height / 2 - player.height / 2;
    addEnemies();
    
}

function gameLoop() {
    update();
    drawEverything();
}

function update() {
    canvas.updateStars();

    if (Game.gameStarted) {
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
        for (var i = 0; i < Game.explosions.length; i++) {
            Game.explosions[i].update();
            if (Game.explosions[i].isFinished()) {
                Game.explosions.splice(i, 1);
            }
        }
        Game.handleCollisions();
        levelUp();
    }
}

function drawEverything() {
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.canvasContext.drawImage(canvas.background, 0, 0);
    canvas.canvasContext.drawImage(canvas.starsLayer,canvas.starsOneX,0);
    canvas.canvasContext.drawImage(canvas.starsLayer, canvas.starsTwoX, 0);

    if (Menu.active) {
        Menu.draw();
    } else if (Game.gameStarted) {
        drawGUI();
        for (var i = 0; i < Game.enemies.length; i++) {
            Game.enemies[i].draw();
        }
        for (var i = 0; i < Game.bonuses.length; i++) {
            Game.bonuses[i].draw();
        }
        for (var i = 0; i < Game.explosions.length; i++) {
            Game.explosions[i].draw();
        }
        for (var i = 0; i < Game.bullets.length; i++)
            Game.bullets[i].draw();
        player.draw();        
    } else if (Game.gameOver) {
        gameOver();
    }
}

function Enemy()
{
    this.hitPoint = Math.round(Math.random() * 10) + 5;
    this.width = 50;
    this.height = 50;
    this.positionX = canvas.width + Math.round(Math.random() * canvas.width * 2);
    this.positionY = Math.round(Math.random() * (canvas.height - 50));
    this.speed = Math.random() + Game.level / 3;
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
        if (this.positionX < 0 - this.width) {
            this.positionX = canvas.width + Math.round(Math.random() * canvas.width * 2);
            this.positionY = Math.round(Math.random() * (canvas.height - 50));
        }
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

function Explosion(posX, posY)
{
    this.positionX = posX;
    this.positionY = posY;
    this.currentFrame = 0;
    this.frameRate = 0;
    this.update = function()
    {
        this.frameRate += 1;
        if(this.frameRate >= 3){
            this.currentFrame++;
            this.frameRate = 0;
        }
    };
    this.isFinished = function()
    {
        if(this.currentFrame >= explosionEffect.length)
            return true;
        else
            return false;
    };
    this.draw = function()
    {
        canvas.canvasContext.drawImage(explosionEffect[this.currentFrame],this.positionX,this.positionY);
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
    } else {
        Game.gameOver = true;
        //Menu.active = true;
        Game.gameStarted = false;
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

function createImage(path)
{
    var tempImage = new Image();
    tempImage.src = path;
    return tempImage;
}

function areColliding(objectOne, objectTwo)
{
    if(objectOne.positionX + objectOne.width >= objectTwo.positionX &&
    objectOne.positionX <= objectTwo.positionX + objectTwo.width &&
    objectOne.positionY + objectOne.height >= objectTwo.positionY &&
    objectOne.positionY <= objectTwo.positionY + objectTwo.height)
        return true;
    else
        return false;
}

function Button(tag, posY)
{
    this.version = 0;
    this.name = tag;
    this.width = 167;
    this.height = 105;
    this.positionX = canvas.width / 2 - 83;
    this.positionY = posY;
}

function levelUp() {
    if (Game.enemies.length === 0) {
        Game.level++;
        addEnemies();
    }
}

function addEnemies() {
    for (var i = 0; i < Game.enemiesPerLevel * Game.level; i++) {
        Game.enemies.push(new Enemy());
    }
}
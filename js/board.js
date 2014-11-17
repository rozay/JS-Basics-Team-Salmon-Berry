window.onload = init;
var enemyImages = [];
var bulletImages = [];
var bonusImages = [];
var explosionEffect = [];
var playerAnimation = [];
var mineAnimation = [];
var bombAnimation = [];

var menuScreenImages = [];
var bgMusic = new Audio("resources/sounds/backgroundMusic.mp3");
var bulletSound = new Audio("resources/sounds/PlayerBullet.mp3");
var explosionSound = new Audio("resources/sounds/explosion.mp3");
var bonus = new Audio("resources/sounds/bonus.mp3");

var GAME_STATES = {'Menu' : 0, 'Playing' : 1, 'GameOver' : 2};
var MENU_BUTTONS_WIDTH = 167;
var MENU_BUTTONS_HEIGHT = 105;

var GAME_OVER_BUTTONS_Y;

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
    gameState : GAME_STATES.Menu,
    enemies : [],
    bullets : [],
    bonuses : [],
    mines : [],
    bombs : [],
    explosions : [],
    handleCollisions : function()
    {
        for(var i = 0; i < this.enemies.length;i++)
        {
            for(var j = 0; j < this.mines.length; j++)
            {
                if(areColliding(this.enemies[i], this.mines[j]) === true)
                {
                    this.explosions.push(new Explosion(this.enemies[i].positionX - 200, this.enemies[i].positionY - 200));
                    this.enemies.splice(i,1);
                    var temp = {'positionX' : this.mines[j].positionX - this.mines[j].rangeWidth / 2, 
                                'positionY' : this.mines[j].positionY - this.mines[j].rangeHeight / 2,
                                'width' : this.mines[j].rangeWidth,
                                'height' : this.mines[j].rangeHeight};
                    for(var k = 0; k < this.enemies.length; k++)
                    {
                        if(areColliding(temp, this.enemies[k]) === true)
                        {
                             this.explosions.push(new Explosion(this.enemies[k].positionX - 200, this.enemies[k].positionY - 200));
                            this.enemies.splice(k,1);    
                        }
                    }
                    this.mines.splice(j,1);
                }
            }
            
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
                    player.health -= this.bullets[j].hitPoint;
                    this.bullets.splice(j, 1);
                    if (player.health <= 0) {
                        player.lives--;
                        checkLives();
                    }
                }
                
                if (this.bullets.length != 0 && this.bullets[j]) {
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
        
        for(var j = 0; j < this.bombs.length; j++)
        {
            if(this.bombs[j].timeToExplode() === true)
            {
                var temp = {'positionX' : this.bombs[j].positionX - this.bombs[j].radiusWidth / 2, 
                            'positionY' : this.bombs[j].positionY - this.bombs[j].radiusHeight / 2,
                            'width' : this.bombs[j].radiusHeight,
                            'height' : this.bombs[j].radiusWidth};
                for(var k = 0; k < this.enemies.length; k++)
                {
                    if(areColliding(temp, this.enemies[k]) === true)
                    {
                         this.explosions.push(new Explosion(this.enemies[k].positionX - 200, this.enemies[k].positionY - 200));
                        this.enemies.splice(k,1);    
                    }
                }
                this.bombs.splice(j,1);
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
    buttons: [new Button('play', canvas.width / 2 - 83, 50), new Button('credits', canvas.width / 2 - 83, 227), 
    new Button('exit', canvas.width / 2 - 83, 394), 
    new Button('playAgain', canvas.width / 2 - 180, canvas.height / 2 + 20),
    new Button('menu', canvas.width / 2 + 10, canvas.height / 2 + 20)],
    draw : function()
    {
        for(var i in this.buttons)
        {
            if(Game.gameState === GAME_STATES.Menu && (this.buttons[i].name === 'play' || this.buttons[i].name === 'credits' || this.buttons[i].name === 'exit'))
            {
            canvas.canvasContext.drawImage(menuScreenImages[this.buttons[i].name][this.buttons[i].version],
                                          this.buttons[i].positionX, this.buttons[i].positionY,
                                          this.buttons[i].width, this.buttons[i].height);
            }
            else if(Game.gameState === GAME_STATES.GameOver && (this.buttons[i].name === 'playAgain' || this.buttons[i].name === 'menu'))
            {
            canvas.canvasContext.drawImage(menuScreenImages[this.buttons[i].name][this.buttons[i].version],
                                          this.buttons[i].positionX, this.buttons[i].positionY,
                                          this.buttons[i].width, this.buttons[i].height);
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
    
    bgMusic.play();
    bgMusic.volume = 0.2;
    bgMusic.loop = true;
    setInterval(gameLoop, 1000 / 60);
    
    MENU_BUTTONS_X = canvas.width / 2 - 83;
    GAME_OVER_BUTTONS_Y = canvas.height / 2 + 20;
}

function mouseClick(event)
{
    var temp = { 'positionX': event.clientX - canvas.canvasElement.offsetLeft, 'positionY': event.clientY - canvas.canvasElement.offsetTop, 'width': 1, 'height': 1 };

    if (Game.gameState === GAME_STATES.Menu) 
    {
        for (var i in Menu.buttons) 
        {
            if (areColliding(temp, Menu.buttons[i]))
            {
                if(Menu.buttons[i].name === 'play') 
                {
                    Game.gameState = GAME_STATES.Playing;
                    startGame();
                }
                else if (Menu.buttons[i].name === 'exit')
                {
                    close();
                }
            } 
        }
    } 
    else if (Game.gameState === GAME_STATES.GameOver) 
    {
        for (var i in Menu.buttons) 
        {
            if (areColliding(temp, Menu.buttons[i]))
            {
                if(Menu.buttons[i].name === 'playAgain') 
                {
                    Game.gameState = GAME_STATES.Playing;
                    startGame();
                }
            
                else if (Menu.buttons[i].name === 'menu')
                {            
                    Game.gameState = GAME_STATES.Menu;
                } 
            }  
        }               
    }   
}

function mouseOver(event)
{
    var temp = { 'positionX': event.clientX - canvas.canvasElement.offsetLeft, 'positionY': event.clientY - canvas.canvasElement.offsetTop, 'width': 1, 'height': 1 };

    if (Game.gameState === GAME_STATES.Menu || Game.gameState === GAME_STATES.GameOver) {
        for (var i in Menu.buttons) {
            if (areColliding(temp, Menu.buttons[i])) {
                Menu.buttons[i].version = 1;
            }
            else {
                Menu.buttons[i].version = 0;
            }
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
    
    for(var i = 1; i <= 8; i++)
    {
        playerAnimation.push(createImage('resources/player/Animation/' + i + '.png'));
    }
    
    for(var i = 1; i <= 2; i++)
    {
        mineAnimation.push(createImage('resources/Weapons/Mine/' + i + '.png'));
    }
    
    for(var i = 1; i <= 3; i++)
    {
        bombAnimation.push(createImage('resources/Weapons/Bomb/' + i + '.png'));
    }
    
    menuScreenImages['play'] = [createImage('resources/Menu/Play.png'), createImage('resources/Menu/Play-hover.png')];
    menuScreenImages['credits'] = [createImage('resources/Menu/Credits.png'), createImage('resources/Menu/Credits-hover.png')];
    menuScreenImages['exit'] = [createImage('resources/Menu/Exit.png'), createImage('resources/Menu/Exit-hover.png')];
    menuScreenImages['playAgain'] = [createImage('resources/Menu/Again.png'), createImage('resources/Menu/Again-hover.png')]; //add
    menuScreenImages['menu'] = [createImage('resources/Menu/Menu.png'), createImage('resources/Menu/Menu-hover.png')]; //add
    
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

    if (Game.gameState === GAME_STATES.Playing)
    {
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
        for (var i = 0; i < Game.mines.length; i++)
            Game.mines[i].update();
        for (var i = 0; i < Game.bombs.length; i++)
            Game.bombs[i].update();
        
        Game.handleCollisions();
        levelUp();
    }
}

function drawEverything() {
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.canvasContext.drawImage(canvas.background, 0, 0);
    canvas.canvasContext.drawImage(canvas.starsLayer,canvas.starsOneX,0);
    canvas.canvasContext.drawImage(canvas.starsLayer, canvas.starsTwoX, 0);

    if (Game.gameState === GAME_STATES.Menu) 
    {
        Menu.draw();
    } else if (Game.gameState === GAME_STATES.Playing) {
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
        for (var i = 0; i < Game.mines.length; i++)
            Game.mines[i].draw();
        for (var i = 0; i < Game.bombs.length; i++)
            Game.bombs[i].draw();
        player.draw();        
    } else if (Game.gameState === GAME_STATES.GameOver) {
        gameOver();
        Menu.draw();
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

function Mine(posX, posY)
{
    this.positionX = posX;
    this.positionY = posY;
    this.width = 50;
    this.height = 50;
    this.rangeWidth = 500;
    this.rangeHeight = 500;
    this.currentFrame = 0;
    this.delay = 10;
    this.currentTime = 0;
    this.draw = function()
    {
        canvas.canvasContext.drawImage(mineAnimation[this.currentFrame], this.positionX, this.positionY);
    };
    this.update = function()
    {
        this.currentTime += 1;
        if(this.currentTime >= this.delay)
        {
            this.currentTime = 0;
            this.currentFrame += 1;
        }
        if(this.currentFrame >= mineAnimation.length)
            this.currentFrame = 0;
    };
}

function Bomb(posX, posY)
{
    this.positionX = posX;
    this.positionY = posY;
    this.width = 50;
    this.height = 35;
    this.radiusWidth = 500;
    this.radiusHeight = 500;
    this.timeBeforeExplode = 10;
    this.currentFrame = 0;
    this.delay = 10;
    this.currentTime = 0;
    this.draw = function()
    {
        canvas.canvasContext.drawImage(bombAnimation[this.currentFrame], this.positionX, this.positionY);
    };
    this.update = function()
    {
        this.timeBeforeExplode -= 0.05;
        this.currentTime += 1;
        if(this.currentTime >= this.delay)
        {
            this.currentTime = 0;
            this.currentFrame += 1;
        }
        if(this.currentFrame >= bombAnimation.length)
            this.currentFrame = 0;
    };
    this.timeToExplode = function()
    {
        if(this.timeBeforeExplode <= 0)
            return true;
        else
            return false;
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
    bonus.play();
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
    explosionSound.play();
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
    if(Game.gameState === GAME_STATES.Playing)
    {
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
        if(event.keyCode == 77)
        {
            Game.mines.push(new Mine(player.positionX, player.positionY));
        }
        if(event.keyCode == 66)
        {
            Game.bombs.push(new Bomb(player.positionX, player.positionY));
        }
    }
}

function keyUp(event) {
    if(Game.gameState === GAME_STATES.Playing)
    {
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
}

function checkLives() {
    player.positionX = undefined;
    player.positionY = undefined;

    if (player.lives > 0) {
        reset();
    } else {
        setTimeout(function () {
            Game.gameState = GAME_STATES.GameOver;
        }, 1000);            
    }
}

function reset() {
    Game.bullets = [];
    setTimeout(function () {
        player.positionX = 0;
        player.positionY = canvas.height / 2 - player.height / 2;
        player.health = 100;
    }, 500);
    
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
    canvas.canvasContext.font = 'bold 50px Arial';
    var gameOver = 'GAME OVER!';
    canvas.canvasContext.fillStyle = '#fff';
    canvas.canvasContext.fillText(gameOver, (canvas.width - canvas.canvasContext.measureText(gameOver).width) / 2, canvas.height / 2 - 100);
    var score = 'Your score: ' + player.score;
    canvas.canvasContext.fillText(score, (canvas.width - canvas.canvasContext.measureText(score).width) / 2, canvas.height / 2 - 30);
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

function Button(tag, posX, posY) {
    this.version = 0;
    this.name = tag;
    this.width = MENU_BUTTONS_WIDTH;
    this.height = MENU_BUTTONS_HEIGHT;
    this.positionX = posX;
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
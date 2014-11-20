var Game = {
    level : 1,
    enemiesPerLevel: 20,
    gameState: GAME_STATES.Menu,
    menuSubState: MENU_SUBSTATES.None,
    enemies: [],
    enemiesFormations: 0,
    bullets : [],
    bonuses : [],
    mines : [],
    bombs : [],
    explosions : [],
    audios : [],
    start : function() {

        if (player.lives === 0) {       
            this.level = 1;
            player.score = 0;
            player.lives = 3;
            this.enemies = [];
            this.reset();
        }
        player.positionX = 0;
        player.positionY = canvas.height / 2 - player.height / 2;
        this.addEnemies();   
    },
    reset : function() {
        player.movingLeft = player.movingDown = player.movingRight = player.movingUp =                   player.fire = false;
        this.bullets = [];
        this.bonuses = [];
        this.mines = [];
        this.bombs = [];
        setTimeout(function () {
            player.positionX = 0;
            player.positionY = canvas.height / 2 - player.height / 2;
            player.health = 100;
            player.bombs = 1;
            player.mines = 1;
            player.doubleGuns = false;
        }, 500);
    },
    levelUp : function() {
        if (this.enemies.length === 0) {
            this.level++;
            player.bombs++;
            player.mines++;
            this.addEnemies();
        }
    },
    addEnemies : function() {
        for (var i = 0; i < this.enemiesPerLevel * this.level; i++) {
            this.enemies.push(new Enemy());
        }
    },
    drawGUI : function() {
    canvas.canvasContext.font = 'normal 28px Roboto';
    canvas.canvasContext.textBaseline = 'top';

    canvas.canvasContext.fillStyle = '#00171a';
    canvas.canvasContext.fillRect(0, 0, canvas.width, STATUSBAR_HEIGHT);

    canvas.canvasContext.fillStyle = '#fff';

    canvas.canvasContext.fillText('Level:  ' + this.level, 10, 0);
    canvas.canvasContext.fillText('Lives:  ' + player.lives, 170, 0);
    canvas.canvasContext.fillText('Bombs:  ' + player.bombs, 330, 0);
    canvas.canvasContext.fillText('Mines:  ' + player.mines, 510, 0);
    canvas.canvasContext.fillText('Score:  ' + player.score, 680, 0);

    canvas.canvasContext.strokeStyle = '#fff';
    canvas.canvasContext.lineWidth = 3;
    canvas.canvasContext.strokeRect(canvas.width - 130, 5, 106, 22);
    canvas.canvasContext.fillStyle = '#00cee9';
    canvas.canvasContext.fillRect(canvas.width - player.health - 27, 8, player.health >= 0 ?         player.health : 0, 16);
    },
    drawObjects : function()
    {
        var i = 0;
        for (i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        }
        for (i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].draw();
        }
        for (i = 0; i < this.explosions.length; i++) {
            this.explosions[i].draw();
        }
        for (i = 0; i < this.bullets.length; i++)
            this.bullets[i].draw();
        for (i = 0; i < this.mines.length; i++)
            this.mines[i].draw();
        for (i = 0; i < this.bombs.length; i++)
            this.bombs[i].draw();
    },
    updateObjects : function()
    {
        var i = 0;
        for (i = 0; i < this.bullets.length; i++)
            this.bullets[i].update();
        for (i = 0; i < this.enemies.length; i++)
            this.enemies[i].update();
        for (i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].update();
            if (this.bonuses[i].checkTime()) {
                this.bonuses.splice(i, 1);
            }
        }
        for (i = 0; i < this.explosions.length; i++) {
            this.explosions[i].update();
            if (this.explosions[i].isFinished()) {
                this.explosions.splice(i, 1);
            }
        }
        for (i = 0; i < this.mines.length; i++)
            this.mines[i].update();
        for (i = 0; i < this.bombs.length; i++){
            this.bombs[i].update();
        }
        for (i = 0; i < this.audios.length; i++) {
            if (this.audios[i].ended === true)
                this.audios.splice(i, 1);
        }
    },
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
                        player.checkLives();
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
                player.checkLives();
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
                this.bombs[j].audio.pause();
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
};
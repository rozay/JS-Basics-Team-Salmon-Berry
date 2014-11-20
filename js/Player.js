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
    bombs: 1,
    mines: 1,
    fireInterval: 3,
    fire: false,
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
        if (this.positionY < STATUSBAR_HEIGHT - this.height)
            this.positionY = canvas.height - this.height;
        else if (this.positionY > canvas.height)       
            this.positionY = STATUSBAR_HEIGHT;
    },
    checkLives : function() {
        this.positionX = undefined;
        this.positionY = undefined;

        if (this.lives > 0) {
            Game.reset();
        } else {
            setTimeout(function () {
                Game.gameState = GAME_STATES.GameOver;
            }, 1000);            
        }
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
        this.fireInterval = this.fireInterval > 0 ? this.fireInterval - 0.3 : 0;

        if (player.fire === true && this.fireInterval === 0) {
            player.fireInterval = 3;
            Game.audios.push(createSound(bulletSound));
            if (player.doubleGuns === true) {
                Game.bullets.push(new Bullet('player', 10, player.speed + 2,
                            0, player.positionX + player.width - 15, player.positionY + 10));
                Game.bullets.push(new Bullet('player', 10, player.speed + 2,
                            0, player.positionX + player.width - 15, player.positionY + player.height - 10));

            }
            else {
                Game.bullets.push(new Bullet('player', 10, player.speed + 2,
                            0, player.positionX + player.width - 15,
                            player.positionY + player.height / 2));
            }
        }
    }
};
function Enemy() {
    this.hitPoint = Math.round(Math.random() * 10) + 5;
    this.width = 50;
    this.height = 50;
    this.positionX = canvas.width + Math.round(Math.random() * canvas.width);
    this.positionY = Math.round(Math.random() * (canvas.height - 50 - STATUSBAR_HEIGHT)) + STATUSBAR_HEIGHT;
    this.speed = Math.random() + Game.level / 3;
    this.typeEnemy = Math.round(Math.random() * 3);
    this.chanceForBonus = Math.round(Math.random() * 80);
    this.firePeriod = 3;
    this.timeAfterFire = 0;
    this.draw = function () {
        canvas.canvasContext.drawImage(enemyImages[this.typeEnemy], this.positionX, this.positionY);
    };
    this.update = function () {
        this.timeAfterFire--;
        this.positionX = this.positionX - this.speed;
        this.positionY = this.positionY;
        this.outOfBoundsCheck()
        if(this.timeAfterFire <= 0){
            this.timeAfterFire = this.firePeriod;
            if(Math.round(Math.random() * 100) === 99)
            {
                Game.bullets.push(new Bullet('enemy', this.hitPoint, -4,
                        1, this.positionX, 
                        this.positionY + this.height / 2 - 4));
            }
        }
    };
    this.outOfBoundsCheck = function () {
        if (this.positionX < 0 - this.width) {
            this.positionX = canvas.width + Math.round(Math.random() * canvas.width);
            this.positionY = Math.round(Math.random() * (canvas.height - 50 - STATUSBAR_HEIGHT)) + STATUSBAR_HEIGHT;
        }
    };
};

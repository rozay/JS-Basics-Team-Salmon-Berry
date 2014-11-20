function Bullet(ownerTag, hitPointValue, speedToApply, bulletType, posX, posY) {
    this.hitPoint = hitPointValue;
    this.positionX = posX;
    this.positionY = posY;
    this.width = 0;
    this.height = 0;
    this.speed = speedToApply;
    this.owner = ownerTag;
    this.typeBullet = bulletType;
    this.update = function () {
        this.positionX += this.speed;
    };
    this.outOfBoundsCheck = function () {
        if (this.positionX > canvas.width || this.positionX < 0)
            return true;
        else
            return false;
    };
    this.draw = function () {
        canvas.canvasContext.drawImage(bulletImages[this.typeBullet], this.positionX, this.positionY);
    };
};
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
};

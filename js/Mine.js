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
};
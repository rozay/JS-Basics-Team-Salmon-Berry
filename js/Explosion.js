function Explosion(posX, posY)
{
    Game.audios.push(createSound(explosionSound));
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
    
};
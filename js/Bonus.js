function Bonus(posX, posY)
{
    Game.audios.push(createSound(bonus));
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
};

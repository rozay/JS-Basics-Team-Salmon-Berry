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

function createImage(path)
{
    var tempImage = new Image();
    tempImage.src = path;
    return tempImage;
}

function createSound(path)
{
    var temp = new Audio(path);
    if(path.match('explosion'))
        temp.volume = 0.15;
    temp.play();
    return temp;
}
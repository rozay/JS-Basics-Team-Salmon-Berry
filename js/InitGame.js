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

    gameLoop();
};

function loadResources() {
    var i = 0;
    for (i = 1; i <= 4; i++) {
        enemyImages.push(createImage('resources/enemy.png'));
    }

    for (i = 1; i <= 10; i++) {
        explosionEffect.push(createImage('resources/Effects/Explosion/Explosion_' + i + '.png'));
    }

    for (i = 1; i <= 8; i++) {
        playerAnimation.push(createImage('resources/player/Animation/' + i + '.png'));
    }

    for (i = 1; i <= 2; i++) {
        mineAnimation.push(createImage('resources/Weapons/Mine/' + i + '.png'));
    }

    for (i = 1; i <= 3; i++) {
        bombAnimation.push(createImage('resources/Weapons/Bomb/' + i + '.png'));
    }

    menuScreenImages['play'] = [createImage('resources/Menu/Play.png'), createImage('resources/Menu/Play-hover.png')];
    menuScreenImages['instructions'] = [createImage('resources/Menu/instructions.png'), createImage('resources/Menu/instructions-hover.png')];
    menuScreenImages['credits'] = [createImage('resources/Menu/Credits.png'), createImage('resources/Menu/Credits-hover.png')];
    menuScreenImages['backToMenu'] = [createImage('resources/Menu/Menu.png'), createImage('resources/Menu/Menu-hover.png')];
    menuScreenImages['playAgain'] = [createImage('resources/Menu/Again.png'), createImage('resources/Menu/Again-hover.png')];
    menuScreenImages['menu'] = [createImage('resources/Menu/Menu.png'), createImage('resources/Menu/Menu-hover.png')];
    menuScreenImages['logo'] = [createImage('resources/blue-force-logo/logo.png'), createImage('resources/blue-force-logo/logo.png')];

    bulletImages.push(createImage('resources/bullet.png'));
    bulletImages.push(createImage('resources/bullet-enemies.png'));
    bonusImages.push(createImage('resources/bonuses/bullets.png'));
    bonusImages.push(createImage('resources/bonuses/repairBonus.png'));

};
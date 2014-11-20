function gameLoop() {
    update();
    drawEverything();
    window.requestAnimationFrame(gameLoop);
};

function update() {
    canvas.updateStars();

    if (Game.gameState === GAME_STATES.Playing) {
        player.update();
        Game.updateObjects();
        Game.handleCollisions();
        Game.levelUp();
    }
};

function drawEverything() {
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.canvasContext.drawImage(canvas.background, 0, 0);
    canvas.canvasContext.drawImage(canvas.starsLayer, canvas.starsOneX, 0);
    canvas.canvasContext.drawImage(canvas.starsLayer, canvas.starsTwoX, 0);

    if (Game.gameState === GAME_STATES.Menu) {
        Menu.draw();
    } else if (Game.gameState === GAME_STATES.Playing) {
        Game.drawObjects();
        player.draw();
        Game.drawGUI();
    } else if (Game.gameState === GAME_STATES.GameOver) {
        Menu.draw();
    }
};
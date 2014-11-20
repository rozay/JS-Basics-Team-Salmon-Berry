function mouseClick(event) {
    var temp = {
        'positionX': event.clientX - canvas.canvasElement.offsetLeft,
        'positionY': event.clientY - canvas.canvasElement.offsetTop,
        'width': 1,
        'height': 1
    };

    if (Game.gameState === GAME_STATES.Menu && Game.menuSubState === MENU_SUBSTATES.None) {
        for (var i in Menu.buttons) {
            if (areColliding(temp, Menu.buttons[i])) {
                if (Menu.buttons[i].name === 'play') {
                    Game.gameState = GAME_STATES.Playing;
                    Game.start();
                } else if (Menu.buttons[i].name === 'instructions') {
                    Game.menuSubState = MENU_SUBSTATES.Instructions;
                } else if (Menu.buttons[i].name === 'credits') {
                    Game.menuSubState = MENU_SUBSTATES.Credits;
                }
            }
        }
    } else if (Game.gameState === GAME_STATES.Menu && (Game.menuSubState === MENU_SUBSTATES.Instructions || Game.menuSubState === MENU_SUBSTATES.Credits)) {
        for (var i in Menu.buttons) {
            if (areColliding(temp, Menu.buttons[i]) && Menu.buttons[i].name === 'backToMenu') {
                Game.menuSubState = MENU_SUBSTATES.None;
            }
        }
    } else if (Game.gameState === GAME_STATES.GameOver) {
        for (var i in Menu.buttons) {
            if (areColliding(temp, Menu.buttons[i])) {
                if (Menu.buttons[i].name === 'playAgain') {
                    Game.gameState = GAME_STATES.Playing;
                    Game.start();
                }

                else if (Menu.buttons[i].name === 'menu') {
                    Game.gameState = GAME_STATES.Menu;
                }
            }
        }
    }
};

function mouseOver(event) {
    var temp = {
        'positionX': event.clientX - canvas.canvasElement.offsetLeft,
        'positionY': event.clientY - canvas.canvasElement.offsetTop,
        'width': 1,
        'height': 1
    };

    if (Game.gameState === GAME_STATES.Menu || Game.gameState === GAME_STATES.GameOver) {
        for (var i in Menu.buttons) {
            if (areColliding(temp, Menu.buttons[i])) {
                Menu.buttons[i].version = 1;
            }
            else {
                Menu.buttons[i].version = 0;
            }
        }
    }
};

function keyDown(event) {
    if (Game.gameState === GAME_STATES.Playing) {
        if (event.keyCode == 39) {
            player.movingRight = true;
            player.playerImage.src = 'resources/player/forward.png';
        }
        else if (event.keyCode == 37) {
            player.movingLeft = true;
            player.playerImage.src = 'resources/player/back.png';
        }
        if (event.keyCode == 38) {
            player.movingUp = true;
            player.playerImage.src = 'resources/player/left.png';
        }
        else if (event.keyCode == 40) {
            player.movingDown = true;
            player.playerImage.src = 'resources/player/right.png';
        }

        if (event.keyCode == 88) {
            player.fire = true;
        }
        if (event.keyCode == 77 && player.mines > 0) {
            Game.mines.push(new Mine(player.positionX, player.positionY));
            player.mines--;
        }
        if (event.keyCode == 66 && player.bombs > 0) {
            Game.bombs.push(new Bomb(player.positionX, player.positionY));
            player.bombs--;
        }
    }
};

function keyUp(event) {
    if (Game.gameState === GAME_STATES.Playing) {
        if (event.keyCode == 39) {
            player.movingRight = false;
            player.playerImage.src = 'resources/player/main.png';

        }
        else if (event.keyCode == 37) {
            player.movingLeft = false;
            player.playerImage.src = 'resources/player/main.png';

        }
        if (event.keyCode == 38) {
            player.movingUp = false;
            player.playerImage.src = 'resources/player/main.png';

        }
        else if (event.keyCode == 40) {
            player.movingDown = false;
            player.playerImage.src = 'resources/player/main.png';
        }
        else if (event.keyCode == 88) {
            player.fire = false;
        }
    }
};
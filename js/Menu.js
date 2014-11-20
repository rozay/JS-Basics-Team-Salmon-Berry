var Menu =
{
    buttons: [
    new Button('play', (canvas.width - 3 * MENU_BUTTONS_WIDTH - 2 * 75) / 2, MENU_BUTTONS_Y),
    new Button('instructions', (canvas.width - 3 * MENU_BUTTONS_WIDTH - 2 * 75) / 2 + (MENU_BUTTONS_WIDTH + 75), MENU_BUTTONS_Y),
    new Button('credits', (canvas.width - 3 * MENU_BUTTONS_WIDTH - 2 * 75) / 2 + 2 * (MENU_BUTTONS_WIDTH + 75), MENU_BUTTONS_Y),
    new Button('backToMenu', (canvas.width - MENU_BUTTONS_WIDTH) / 2, canvas.height - MENU_BUTTONS_HEIGHT - 50),
    new Button('playAgain', (canvas.width - 2 * MENU_BUTTONS_WIDTH - 50) / 2, canvas.height / 2 + 20),
    new Button('menu', (canvas.width - 2 * MENU_BUTTONS_WIDTH - 50) / 2 + MENU_BUTTONS_WIDTH + 50, canvas.height / 2 + 20)],
    draw: function () {

        if (Game.gameState === GAME_STATES.Menu && Game.menuSubState === MENU_SUBSTATES.None) {
            canvas.canvasContext.drawImage(menuScreenImages['logo'][0],(canvas.width - 622) / 2, 0, 622, 350);
        }

        for (var i = 0; i < this.buttons.length; i++) {
            if (Game.gameState === GAME_STATES.Menu && Game.menuSubState === MENU_SUBSTATES.None && (this.buttons[i].name === 'play' || this.buttons[i].name === 'instructions' || this.buttons[i].name === 'credits')) {
                canvas.canvasContext.drawImage(menuScreenImages[this.buttons[i].name][this.buttons[i].version],
                                          this.buttons[i].positionX, this.buttons[i].positionY,
                                          this.buttons[i].width, this.buttons[i].height);

            } else if (Game.gameState === GAME_STATES.Menu && Game.menuSubState === MENU_SUBSTATES.Instructions && this.buttons[i].name === 'backToMenu') {
                var count = 0;
                var keys = {
                    up: 'Move Up:   UP arrow',
                    down: 'Move Down:   DOWN arrow',
                    left: 'Move Left:   LEFT arrow',
                    right: 'Move Right:   RIGHT arrow',
                    fire: 'Fire:   X',
                    bomb: 'Drop Bomb:   B',
                    mine: 'Drop Mine:   M'
                }

                canvas.canvasContext.font = 'normal 24px Roboto';
                canvas.canvasContext.fillStyle = '#fff';

                for (var key in keys) {
                    canvas.canvasContext.fillText(keys[key], (canvas.width - canvas.canvasContext.measureText(keys[key]).width) / 2, 75 + 50 * count);
                    count++;
                }

                canvas.canvasContext.drawImage(menuScreenImages[this.buttons[i].name][this.buttons[i].version],
                                          this.buttons[i].positionX, this.buttons[i].positionY,
                                          this.buttons[i].width, this.buttons[i].height);

            } else if (Game.gameState === GAME_STATES.Menu && Game.menuSubState === MENU_SUBSTATES.Credits && this.buttons[i].name === 'backToMenu') {
                var names = [
                    'TEAM "SALMON BERRY"',
                    'Rositsa Popova',
                    'Deivid Raychev',
                    'Georgi Barov',
                    'Nikola Nikolov'
                ]

                canvas.canvasContext.font = 'normal 35px Roboto';
                canvas.canvasContext.fillStyle = '#fff';
                canvas.canvasContext.fillText(names[0], (canvas.width - canvas.canvasContext.measureText(names[0]).width) / 2, canvas.height / 2 - 200);

                for (var j = 1; j < names.length; j++) {
                    canvas.canvasContext.fillText(names[j], (canvas.width - canvas.canvasContext.measureText(names[j]).width) / 2, canvas.height / 2 - 180 + j * 60);
                }

                canvas.canvasContext.drawImage(menuScreenImages[this.buttons[i].name][this.buttons[i].version],
                                          this.buttons[i].positionX, this.buttons[i].positionY,
                                          this.buttons[i].width, this.buttons[i].height);

            } else if (Game.gameState === GAME_STATES.GameOver && (this.buttons[i].name === 'playAgain' || this.buttons[i].name === 'menu')) {
                var gameOver = 'GAME OVER!';
                var score = 'Your score: ' + player.score;
                canvas.canvasContext.font = 'normal 50px Roboto';
                canvas.canvasContext.fillStyle = '#fff';
                canvas.canvasContext.textBaseline = 'top';
                canvas.canvasContext.fillText(gameOver, (canvas.width - canvas.canvasContext.measureText(gameOver).width) / 2, canvas.height / 2 - 200);
                canvas.canvasContext.fillText(score, (canvas.width - canvas.canvasContext.measureText(score).width) / 2, canvas.height / 2 - 100);
                canvas.canvasContext.drawImage(menuScreenImages[this.buttons[i].name][this.buttons[i].version],
                                              this.buttons[i].positionX, this.buttons[i].positionY,
                                              this.buttons[i].width, this.buttons[i].height);
            }
        }
    }
};
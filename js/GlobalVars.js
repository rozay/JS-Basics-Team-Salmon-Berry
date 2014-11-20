window.onload = init;
var enemyImages = [];
var bulletImages = [];
var bonusImages = [];
var explosionEffect = [];
var playerAnimation = [];
var mineAnimation = [];
var bombAnimation = [];

var menuScreenImages = [];
var bgMusic = new Audio("resources/sounds/backgroundMusic.mp3");
var bulletSound = "resources/sounds/PlayerBullet.mp3";
var explosionSound = "resources/sounds/explosion.mp3";
var bonus = ("resources/sounds/bonus.mp3");
var bombTick = ("resources/sounds/bomb-tick.mp3");

var GAME_STATES = { 'Menu': 0, 'Playing': 1, 'GameOver': 2 };
var MENU_SUBSTATES = { 'None': 0, 'Instructions': 1, 'Credits': 2 };
var MENU_BUTTONS_WIDTH = 167;
var MENU_BUTTONS_HEIGHT = 105;
var MENU_BUTTONS_Y = 350;
var STATUSBAR_HEIGHT = 34;

var canvas = {
    canvasElement : document.getElementById('canvas'),
    canvasContext : undefined,
    width : 1024,
    height: 620,
    background : new Image(),
    starsLayer : new Image(),
    starsOneX : 0,
    starsTwoX : 1024,
    updateStars : function()
    {
        this.starsOneX -= 2;
        this.starsTwoX -= 2;
        if(this.starsOneX <= -this.width)
            this.starsOneX = this.width;
        else if(this.starsTwoX  <= -this.width)
            this.starsTwoX = this.width;
    }
};
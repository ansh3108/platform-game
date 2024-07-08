var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1000,
    height = 600,
    player = {
        x: width / 2 - 90,
        y: height - 25,
        width: 5,
        height: 5,
        speed: 3,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
        projectileTimer: Date.now(),
        shootDelay: 200,
        name: "Alex",
        score: 0,
        cheatmode: false,
        bullets: 8
    },
    keys = [],
    friction = 0.80,
    gravity = 0.3,
    projectiles = [];

canvas.width = width;
canvas.height = height;

var playerInitX = width / 2 - 90;
var playerInitY = height - 25;
var initScore = 0;
var gameWidth = 800;
var monsters = [];
var flyingMonster;
var goodThings = [];
var exit;
var portalStart, portalEnd;
var score = 100;
var startTime;
var givenTime = 100;
var elapsedTime, remainingTime;
var isGameOver = false;
var isNextLevel = false;
var isFirstTime = true;
var scoreTable;
var currentLevel = 1;
var facing = "E";
var count = 0;
var currX, currY;
var boxes = [];
var PATH_CHAR = "images/sprite_sheet2.png";
var CHAR_WIDTH = 24, CHAR_HEIGHT = 32, IMAGE_START_EAST_Y = 32, IMAGE_START_WEST_Y = 96, SPRITE_WIDTH = 72;
var COIN_WIDTH = 15, COIN_HEIGHT = 16, COIN_SPRITE_WIDTH = 60;
var FLYING_MONSTER_WIDTH = 32, FLYING_MONSTER_HEIGHT = 32, FLYING_MONSTER_SPRITE_WIDTH = 128;
var PROJECTILE_WIDTH = 23, PROJECTILE_HEIGHT = 7;
var projectileSpriteY = 0;
var coinSpriteX = 0;
var TEXT_PRELOADING = "Loading ...", TEXT_PRELOADING_X = 200, TEXT_PRELOADING_Y = 200;
var charImage = new Image();
charImage.src = PATH_CHAR;
var monsterImage = new Image();
monsterImage.src = "images/monster_sprite2.png";
var goodThingImage = new Image();
goodThingImage.src = "images/coin_sprite.png";
var tileImage = new Image();
tileImage.src = "images/tile_sprite.png";
var exitImage = new Image();
exitImage.src = "images/exit_sprite.png";
var bgImage = new Image();
bgImage.src = "images/background_sprite1.png";
var teleporterImage = new Image();
teleporterImage.src = "images/teleporter_sprite.png";
var projectileImage = new Image();
projectileImage.src = "images/projectile_sprite.png";
var flyingMonsterImage = new Image();
flyingMonsterImage.src = "images/bat_sprite.png";
var bgMusic = new Audio("sounds/background.wav");
bgMusic.loop = true;
bgMusic.play();
var shootSnd = new Audio("sounds/arrow.wav");
shootSnd.loop = false;
var hitSnd = new Audio("sounds/hit.wav");
hitSnd.loop = false;
var levelupSnd = new Audio("sounds/levelup.wav");
levelupSnd.loop = false;
var gameoverSnd = new Audio("sounds/gameover.wav");
gameoverSnd.loop = false;
currX = 0;
currY = IMAGE_START_EAST_Y;

var GAME_MAP = new Array(
    "                                        ",
    "                                        ",
    " E                                      ",
    "###                                     ",
    "  #                                     ",
    "  ##   X    G     X             G       ",
    "  ##################################    ",
    "             ##                         ",
    "             ##                       ##",
    "          G  ##  X G                 ###",
    "         ###########                ####",
    "#    #                 ##       ########",
    "# T ##                ######            ",
    "#########          ##########           ",
    "            ##      ##########          ",
    "           #####                        ",
    "         ########  F                 MMM",
    "    ######     ##               MMMMMMMM",
    "##              ###   ### G             ",
    "###               #   #######           ",
    "######    G       #   #########      X  ",
    "#####     #                        #####",
    "        ####   X                  ######",
    "       #############             #######",
    "      #####             G  ##   ######  ",
    " P   ###                ####            ",
    "##                    ####              ",
    "###           # #                       ",
    "#### G #  X  ######   G  X     X   ##   ",
    "########################################"
);

function initialiseMap() {
    var y, x;
    for (y = 0; y < GAME_MAP.length; y++) {
        var start = null, end = null;
        var isMovable = false;
        for (x = 0; x < GAME_MAP[y].length; x++) {
            if (start == null && (GAME_MAP[y].charAt(x) == '#' || GAME_MAP[y].charAt(x) == 'M')) {
                start = x;
                isMovable = GAME_MAP[y].charAt(x) == 'M' ? true : false;
            }
            if (start != null && GAME_MAP[y].charAt(x) == ' ') {
                end = x - 1;
            }
            if (start != null && x == GAME_MAP[y].length - 1) {
                end = x;
            }
            if (start != null && end != null) {
                boxes.push({
                    x: start * 20,
                    y: y * 20,
                    width: (end - start + 1) * 20,
                    height: 20,
                    isMovable: isMovable
                });
                start = end = null;
            }

            if (GAME_MAP[y].charAt(x) == 'E') {
                exit = {
                    x: x * 20,
                    y: y * 20
                };
            }

            if (GAME_MAP[y].charAt(x) == 'P') {
                playerInitX = x * 20;
                playerInitY = y * 20;
            }

            if (GAME_MAP[y].charAt(x) == 'G') {
                goodThings.push({
                    x: x * 20,
                    y: y * 20,
                    width: 20,
                    height: 20
                });
            }

            if (GAME_MAP[y].charAt(x) == 'F') {
                flyingMonster = {
                    x: x * 20,
                    y: y * 20,
                    width: 20,
                    height: 20,
                    velY: 2
                };
            }

            if (GAME_MAP[y].charAt(x) == 'X') {
                monsters.push({
                    x: x * 20,
                    y: y * 20,
                    width: 20,
                    height: 20,
                    velX: 2
                });
            }

            if (GAME_MAP[y].charAt(x) == 'T') {
                portalStart = {
                    x: x * 20,
                    y: y * 20,
                    width: 20,
                    height: 20
                };
            }

            if (GAME_MAP[y].charAt(x) == 'M') {
                portalEnd = {
                    x: x * 20,
                    y: y * 20,
                    width: 20,
                    height: 20
                };
            }
        }
    }
}

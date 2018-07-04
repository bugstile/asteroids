/**
 * Shim layer, polyfill, for requestAnimationFrame with setTimeout fallback.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canShootAI = true;
var canShoot = true;
var powerup = false;

/**
 * Asteroids, the Game
 */
window.Asteroids = (function () {

    var powerupTimer = new Date().getTime() / 1000;
    var dt, click, opponents, asteroids, powerups, smallasteroids, projectiles, projectilesAI, ctx, ship, opponent, lastGameTick, width, height, ships;
    var score = 0;
    var level = 100;
    var AsteroidAmount = 8;
    var OpponentAmount = 1;
    var increase = 500;
    var difficulty = 1;
    var gamestate = 0;
    var pausetrigger = 0;

    var init = function (canvas) {
        dt = 0;
        powerup = false;
        click = 0;
        score = 0;
        canvas = document.getElementById(canvas);
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        ctx.lineWidth = 2;
        ship = new Player(20, 30, new Vector(width / 2, height / 2), new Vector(2, 2), 0);
        ships = [ship];
        projectiles = [];
        projectilesAI = [];
        opponents = [];
        asteroids = [];
        smallasteroids = [];
        powerups = [];
        gamestate = 0;
    };

    var pauseCheck = function () {
        if (gamestate != 2) {
            if (Key.isDown(Key.PAUSE) && pausetrigger == 0) {
                gamestate = 1;
                pausetrigger = 1;
            }
            if (!Key.isDown(Key.PAUSE) && pausetrigger == 1) {
                pausetrigger = 2;
            }
            if (Key.isDown(Key.PAUSE) && pausetrigger == 2) {
                pausetrigger = 3;
            }
            if (!Key.isDown(Key.PAUSE) && pausetrigger == 3) {
                pausetrigger = 0;
                gamestate = 0;
            }
        }
    };

    var restartCheck = function () {
        if (Key.isDown(Key.ENTER)) {
            difficulty = 1;
            increase = 500;
            init('canvas');
        }
    };

    var powerupCheck = function () {
        if (powerup == true) {
            if ((new Date().getTime() / 1000) >= powerupTimer) {
                powerup = false;
            }
        }
    };

    var update = function (dt) {
        this.dt = dt;
        pauseCheck();

        
        /*
        *  Checks if the game is running or not. 
        */
        if (gamestate == 0) {

            powerupCheck();
            scoreUpdate(score, difficulty);
            ship.update(dt, width, height, projectiles);

            if (score >= level) {
                trySpawnObject(powerups, new Powerup(), 1);
                level += 100;
                console.log("Score:" + level);
            }

            if (score >= increase) {
                AsteroidAmount += 4;
                increase += 500;
                difficulty += 1;
                console.log("Level = " + difficulty);
            }

            if (score == 10) {
                trySpawnObject(powerups, new Powerup(), 1);
            }
            
            for (var i = 0; i < projectiles.length; i++) {
                projectiles[i].moveForward(dt);
            }

            for (var f = 0; f < projectilesAI.length; f++) {
                projectilesAI[f].moveForward(dt);
            }


            trySpawnObject(asteroids, new Asteroid(), AsteroidAmount);
            trySpawnObject(opponents, opponent = new Enemy(), OpponentAmount);
            opponents[0].update(dt, width, height, projectilesAI, ship, ctx);
            movementHandler(asteroids);
            movementHandler(ship);
            movementHandler(smallasteroids);
            movementHandler(powerups);
            collisionHandler(asteroids, projectiles, spawnSmallAsteroids, true, true);
            collisionHandler(smallasteroids, projectiles, givePoints, true, true);
            collisionHandler(asteroids, ships, gameOver, false, false);
            collisionHandler(smallasteroids, ships, gameOver, false, false);
            collisionHandler(powerups, ships, powerupEnable, true, false);
            collisionHandler(ships, projectilesAI, gameOver, false, false);
            collisionHandler(opponents, projectiles, givePoints, true, true);

        }

        /*
        *  Checks if the game is running or not. 
        */
        if (gamestate == 1) {
            gamePaused();
        }

        /*
        *  Checks if the game is running or not.
        */
        if (gamestate == 2) {
            gameOver();
            restartCheck();
        }

    };


    var drawObjects = function (objectList) {
        for (var i = 0; i < objectList.length; i++) {
            objectList[i].draw(ctx);
        }
    };

    var render = function () {
        clear();
        ship.draw(ctx);
        ctx.beginPath();
        drawObjects(projectiles);
        ctx.stroke();
        ctx.beginPath();
        drawObjects(projectilesAI);
        ctx.stroke();
        ctx.beginPath();
        drawObjects(asteroids);
        drawObjects(opponents);
        drawObjects(smallasteroids);
        drawObjects(powerups);
    };

    var givePoints = function () {
        score++;
    };

    var clear = function () {
        ctx.clearRect(0, 0, width, height);
    };

    var trySpawnObject = function (objectList, object, maximum) {
        if (objectList.length < maximum) {
            objectList.push(object);
        }
    };

    var checkObjectsCollision = function (object, object2) {
        return !!(object.position.x + object.width > object2.position.x &&
        object.position.x < object2.position.x &&
        object.position.y + object.height > object2.position.y &&
        object.position.y < object2.position.y);

    };

    var movementHandler = function (objectlist) {
        for (var i = 0; i < objectlist.length; i++) {
            objectlist[i].moveForward(this.dt);
            objectlist[i].stayInArea(800, 600);
        }
    };

    var collisionHandler = function (objects1, objects2, action, remove1, remove2) {
        for (var i = 0; i < objects1.length; i++) {
            for (var j = 0; j < objects2.length; j++) {
                if (checkObjectsCollision(objects1[i], objects2[j]) == true) {
                    action(objects1[i]);
                    if (remove1 == true) {
                        objects1.splice(i, 1);
                    }
                    if (remove2 == true) {
                        objects2.splice(j, 1);
                        break;
                    }
                }
            }
        }
    };

    var spawnSmallAsteroids = function (object) {
        givePoints();
        smallasteroids.push(
            new SmallAsteroid(
                28, 28, new Vector(
                    object.position.x,
                    object.position.y
                ),
                100, 100,
                object.direction
            ),
            new SmallAsteroid(
                38, 38, new Vector(
                    object.position.x + 30,
                    object.position.y + 30
                ),
                100, 100,
                object.direction * 0.2
            )
        );
    };
    var powerupEnable = function () {
        powerup = true;
        powerupTimer = (new Date().getTime() / 1000) + 3;
        score++;
    };


    var gameOver = function () {
        scoreUpdate(score);
        gamestate = 2;
        display3Lines('red', 'YOU DIED', 'SCORE: ' + score, 'To restart press ENTER');
    };

    var gamePaused = function () {
        scoreUpdate(score);
        display3Lines('yellow', 'YOU PAUSED', 'SCORE: ' + score, 'To resume press P');
    };

    var display3Lines = function (color, text1, text2, text3) {
        ctx.fillStyle = color;
        ctx.font = '50px OptimusPrinceps';
        ctx.fillText(text1, ((this.canvas.width / 2) - (ctx.measureText(text1).width / 2)), 270);
        ctx.fillText(text2, ((this.canvas.width / 2) - (ctx.measureText(text2).width / 2)), 330);
        ctx.fillText(text3, ((this.canvas.width / 2) - (ctx.measureText(text3).width / 2)), 390);
    };

    var scoreUpdate = function (score) {
        ctx.fillStyle = 'white';
        ctx.font = '25px OptimusPrinceps';
        ctx.fillText("score: " + score, 10, 30, 300);
        ctx.fillText("level: " + difficulty, this.canvas.width - 100, 30, 100);
        var numba = Math.round(powerupTimer - (new Date().getTime() / 1000));
        if (numba < 0) {
            numba = 0;
        }
        ctx.fillText("Power: " + numba, this.canvas.width / 2 - 50, 30, 100);
    };


    var gameLoop = function () {
        var now = Date.now(),
            dt = (now - (lastGameTick || now)) / 1000;
        lastGameTick = now;
        requestAnimFrame(gameLoop);

        render();
        update(dt);
    };

    return {
        'init': init,
        'gameLoop': gameLoop
    }

})();

window.onload = function () {
    'use strict';

    Asteroids.init('canvas');
    Asteroids.gameLoop();

    console.log('Ready to play.');

};
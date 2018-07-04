/**
*  To spawn the asteroids randomly on the border of the screen
*/  
function chooseRandomPosition() {
    var decide = randomIntFromInterval(1, 4);
    var randPosX = randomIntFromInterval(0, 800);
    var randPosY = randomIntFromInterval(0, 600);

    switch (decide) {
        case 1:
            //top right
            return new Vector(790, randPosY);
            break;
        case 2:
            //bottom left
            return new Vector(-55, randPosY);
            break;
        case 3:
            //top left
            return new Vector(randPosX-30, -55);
            break;
        case 4:
            //bottom right
            return new Vector(randPosX-30, 590);
            break;
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
*  To spawn the AI specifically, same as the above function.
*/  
function chooseRandomPositionAI() {
    decide = randomIntFromInterval(1, 4);
    randPosX = randomIntFromInterval(0, 700);
    randPosY = randomIntFromInterval(0, 500);

    switch (decide) {
        case 1:
            //top right
            return new Vector(750, randPosY+50);
            break;
        case 2:
            //bottom left
            return new Vector(30, randPosY+50);
            break;
        case 3:
            //top left
            return new Vector(randPosX+50, 25);
            break;
        case 4:
            //bottom right
            return new Vector(randPosX+50, 550);
            break;
    }
}
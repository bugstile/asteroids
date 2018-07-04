/**
 * An asteroid as an object.
 */
function Asteroid(width, height, position, velocity, speed) {
    this.height = height || 64;
    this.width = width || 64;
    this.position = position || chooseRandomPosition();
    this.velocity = velocity || new Vector(1, 1);
    this.speed = speed || new Vector(1, 1);
    this.direction =  randomIntFromInterval(0, 360);
    this.dAngle = Math.PI / 40;
}

/**
 * An asteroid as a prototype.
 */
Asteroid.prototype = {
    draw: function (ctx) {
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);

    },
    moveForward: function (dt) {
        this.position.x += Math.cos(this.direction) * dt * 100;
        this.position.y += Math.sin(this.direction) * dt * 100;
    },

    stayInArea: function (width, height) {
        if (this.position.y < -this.height) this.position.y = height;
        if (this.position.y > height) this.position.y = -this.height;
        if (this.position.x > width) this.position.x = -this.width;
        if (this.position.x < -this.width) this.position.x = width;
    }
};

/**
 * A small asteroid as an object
 */
function SmallAsteroid(width, height, position, velocity, speed, direction) {
    this.height = height || 32;
    this.width = width || 32;
    this.position = position || new Vector(1, 1);
    this.velocity = velocity || new Vector(1, 1);
    this.speed = speed || new Vector();
    this.direction = direction || 0;
    this.dAngle = Math.PI / 40;
}

/**
 * A small asteroid as a prototype.
 */
SmallAsteroid.prototype = {
    draw: function (ctx) {
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        ctx.strokeStyle = "blue";
    },
    moveForward: function (dt) {
        this.position.x += Math.cos(this.direction) * dt * 100;
        this.position.y += Math.sin(this.direction) * dt * 100;
    },

    stayInArea: function (width, height) {
        if (this.position.y < -this.height) this.position.y = height;
        if (this.position.y > height) this.position.y = -this.height;
        if (this.position.x > width) this.position.x = -this.width;
        if (this.position.x < -this.width) this.position.x = width;
    }
};
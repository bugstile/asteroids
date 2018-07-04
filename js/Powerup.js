/**
* A powerup as an object.
*/
function Powerup(width, height, position, velocity, speed, direction) {
    this.height = height || 22;
    this.width = width || 22;
    this.position = position || chooseRandomPositionAI();
    this.velocity = velocity || new Vector(1, 1);
    this.speed = speed || new Vector(1, 1);
    this.direction = direction || 50;
    this.dAngle = Math.PI / 40;
}

Powerup.prototype = {
    draw: function (ctx) {
        ctx.strokeStyle = "orange";
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
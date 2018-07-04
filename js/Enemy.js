/**
 * A Enemy as an object.
 */
function Enemy(speed) {
    this.height = 40;
    this.width = 40;
    this.position = 0 || chooseRandomPositionAI();
    this.velocity = 200 || new Vector(1, 1);
    this.speed = new Vector(1,1);
    this.direction = new Vector(2, 2);
    this.dAngle = Math.PI / 40;
}


/**
 * A Enemy as a prototype.
 */
Enemy.prototype = {
    draw: function (ctx) {
        ctx.strokeStyle = "blue";
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.direction + Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.lineTo(0, this.height / 2 - this.height * 0);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.lineTo(0, -this.height / 2);
        ctx.stroke();
        ctx.restore();
    },

    moveForward: function (dt) {
        this.position.x += Math.cos(this.direction) * dt * 00;
        this.position.y += Math.sin(this.direction) * dt * 00;
    },

    turnTorwardsPlayer: function (ship) {
        var angleRadians = Math.atan2(this.position.y -
            ship.position.y,
            this.position.x -
            ship.position.x);
        this.direction = angleRadians + Math.PI;

    },

    update: function (dt, width, height, projectilesAI, ship, ctx) {
        ctx.strokeStyle = "blue";
        if (canShootAI) {
            projectilesAI.push(new ProjectileAI(
                new Vector(this.position.x, this.position.y),
                new Vector(this.velocity.x, this.velocity.y),
                new Vector(this.speed.x, this.speed.y),
                this.direction));
            canShootAI = false;
            setTimeout(function () {
                canShootAI = true;
            }, 3000);
        }

        this.turnTorwardsPlayer(ship);
        this.moveForward(dt);
        this.stayInArea(width, height);
    },

    stayInArea: function (width, height) {
        if (this.position.y < -this.height) this.position.y = height;
        if (this.position.y > height) this.position.y = -this.height;
        if (this.position.x > width) this.position.x = -this.width;
        if (this.position.x < -this.width) this.position.x = width;
    },
};
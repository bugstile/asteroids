/**
* A projectile as an object
*/
function Projectile(position, velocity, speed, direction) {
    this.position = position || new Vector();
    this.velocity = velocity || new Vector();
    this.speed = speed || new Vector();
    this.direction = direction || 0;
}

Projectile.prototype = {
    draw: function (ctx) {
        if (powerup == false) {
            ctx.strokeStyle = 'orange';
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x - Math.cos(this.direction) * 15, this.position.y - Math.sin(this.direction) * 15);
        } else {
            ctx.strokeStyle = 'red';
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x - Math.cos(this.direction) * 15, this.position.y - Math.sin(this.direction) * 15);
        }
    },
    moveForward: function (dt) {
        this.position.x += 400 * Math.cos(this.direction) * dt;
        this.position.y += 400 * Math.sin(this.direction) * dt;
    },
};

/**
* A projectile as an object for AI
*/
function ProjectileAI(position, velocity, speed, direction) {
    this.position = position || new Vector();
    this.velocity = velocity || new Vector();
    this.speed = speed || new Vector();
    this.direction = direction || 0;
}

ProjectileAI.prototype = {
    draw: function (ctx) {
        ctx.strokeStyle = 'blue';
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x - Math.cos(this.direction) * 15,
                   this.position.y - Math.sin(this.direction) * 15);
    },

    moveForward: function (dt) {
        this.position.x += 200 * Math.cos(this.direction) * dt;
        this.position.y += 200 * Math.sin(this.direction) * dt;
    },

};
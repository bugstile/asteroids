/**
 * A Player as an object.
 */
function Player(width, height, position, velocity, speed, direction, accelerateForce, breakForce) {
    this.height = height || 32;
    this.width = width || 32;
    this.position = position || new Vector();
    this.velocity = velocity || new Vector(1, 1);
    this.speed = speed || new Vector();
    this.direction = direction || 0;
    this.dAngle = Math.PI / 40;
    this.accelerateForce = accelerateForce || Forces.createAcceleration(new Vector(80, 80));
    this.breakForce = breakForce || Forces.createDamping(0.97);
}

Player.prototype = {
    draw: function (ctx) {
        ctx.strokeStyle = "orange";
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.direction + Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.lineTo(0, this.height / 2 - this.height * 0.3);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.lineTo(0, -this.height / 2);

        ctx.stroke();
        ctx.restore();
    },
    moveForward: function (dt) {
        this.position.x += this.speed.x * Math.cos(this.direction) * dt;
        this.position.y += this.speed.y * Math.sin(this.direction) * dt;
        this.position.iadd(this.velocity.muls(dt))
    },

    throttle: function (dt) {
        this.accelerateForce(this.speed, dt);
    },
    breaks: function (dt) {
        this.breakForce(this.speed, dt);
        this.breakForce(this.velocity, dt);
    },

    rotateLeft: function () {
        this.direction -= this.dAngle;
    },

    rotateRight: function () {
        this.direction += this.dAngle;
    },

    update: function (dt, width, height, projectiles) {

        if (Key.isDown(Key.UP)) this.throttle(dt);
        if (Key.isDown(Key.LEFT)) this.rotateLeft();
        if (Key.isDown(Key.DOWN)) this.breaks(dt);
        if (Key.isDown(Key.RIGHT)) this.rotateRight();
        if (Key.isDown(Key.SPACE)) {
            if (canShoot) {
                canShoot = false;
                if (powerup == false) {
                /**
                * Projectile decisionmaking
                */
                    projectiles.push(new Projectile(
                        new Vector(this.position.x, this.position.y),
                        new Vector(this.velocity.x, this.velocity.y),
                        new Vector(this.speed.x, this.speed.y),
                        this.direction)
                    );
                    setTimeout(function () {
                        canShoot = true;
                    }, 120);
                } else {
                /**
                * Changes the projectile to match the powerup picked up
                */
                    projectiles.push(
                        new Projectile(
                            new Vector(this.position.x, this.position.y),
                            new Vector(this.velocity.x, this.velocity.y),
                            new Vector(this.speed.x, this.speed.y),
                            this.direction),
                        new Projectile(
                            new Vector(this.position.x, this.position.y),
                            new Vector(this.velocity.x, this.velocity.y),
                            new Vector(this.speed.x, this.speed.y),
                            this.direction + 0.2),
                        new Projectile(
                            new Vector(this.position.x, this.position.y),
                            new Vector(this.velocity.x, this.velocity.y),
                            new Vector(this.speed.x, this.speed.y),
                            this.direction - 0.2));

                    setTimeout(function () {
                        canShoot = true;
                    }, 40);
                }
            }
        }
        Forces.update(this.velocity, dt);
        this.moveForward(dt);
        this.stayInArea(width, height);
    },

    stayInArea: function (width, height) {
        if (this.position.y < -this.height) this.position.y = height;
        if (this.position.y > height) this.position.y = -this.height;
        if (this.position.x > width) this.position.x = -this.width;
        if (this.position.x < -this.width) this.position.x = width;
    }
};
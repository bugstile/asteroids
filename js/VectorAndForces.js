/**
 * All objects are Vectors
 */
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * A vector as a prototype
 */
Vector.prototype = {
    muls: function (scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }, // Multiply with scalar
    imuls: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    },      // Multiply itself with scalar
    adds: function (scalar) {
        return new Vector(this.x + scalar, this.y + scalar);
    }, // Multiply with scalar
    iadd: function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }   // Add itself with Vector
};

/**
 * The forces around us.
 */
function Forces() {
    this.all = {};
}

Forces.prototype = {
    createAcceleration: function (vector) {
        return function (velocity, dt) {
            velocity.iadd(vector.muls(dt));
        }
    },

    createDamping: function (damping) {
        return function (velocity, dt) {
            velocity.imuls(damping);
        }
    },

    addAcceleration: function (name, vector) {
        this.all[name] = this.createAcceleration(vector);
    },
    addDamping: function (name, damping) {
        this.all[name] = this.createDamping(damping);
    },

    update: function (object, dt) {
        for (var force in this.all) {
            if (this.all.hasOwnProperty(force)) {
                this.all[force](object, dt);
            }
        }
    }
};

window.Forces = new Forces();
window.Forces.addAcceleration('gravity', new Vector(0, 9.82));
window.Forces.addDamping('drag', 0.97);
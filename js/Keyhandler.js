/**
 * Trace the keys pressed
 * http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
 */

Key = {
    pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    ENTER: 13,
    PAUSE: 80,
    FREEZE: 90,

    isDown: function (keyCode) {
        return this.pressed[keyCode];
    },

    onKeydown: function (event) {
        this.pressed[event.keyCode] = true;
    },

    onKeyup: function (event) {
        delete this.pressed[event.keyCode];
    }
};
window.addEventListener('keyup', function (event) {
    Key.onKeyup(event);
}, false);

window.addEventListener('keydown', function (event) {
    if ([Key.LEFT, Key.RIGHT, Key.DOWN, Key.UP, Key.SPACE, Key.PAUSE, Key.ENTER].indexOf(event.keyCode) > -1) {
        event.preventDefault();
        Key.onKeydown(event);
    }

}, false);


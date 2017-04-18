'use strict';
//global variables
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;
var CANVAS_WIDTH = BLOCK_WIDTH * 5;
var ENEMY_SPEED = [100, 500];
var ENEMY_Y = [63, 146, 229];
var gameStates = ['playing', 'over'];
var curGameState = gameStates[0];
var lives = 3;
var score = 0;
// helper function (random integer generator)
function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// Superclass of the Enemy and the Player classes
var Actor = function (sprite, x, y) {
    this.sprite = sprite; //url for the image
    this.x = x;
    this.y = y;
};
// render the game according to the lives count
Actor.prototype.render = function () {
    if (lives > 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    if (lives === 0) {
        curGameState = gameStates[1];
    }
};


// Enemies our player must avoid it is a subclass of the Actor class
var Enemy = function () {
    // The image/sprite for our enemies
    var sprite = 'images/enemy-bug.png';
    var x = -BLOCK_WIDTH;
    var y = ENEMY_Y[generateRandom(0, 3)]; // Pick a random position for the enemy movement
    this.speed = generateRandom(ENEMY_SPEED[0], ENEMY_SPEED[1]);
    Actor.call(this, sprite, x, y);
};
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;


// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > CANVAS_WIDTH) {
        this.reset();
    }
};
// Reset the enemy's position after it exceed the canvas width
Enemy.prototype.reset = function () {
    this.x = -BLOCK_WIDTH;
    this.y = ENEMY_Y[generateRandom(0, 3)];
    this.speed = generateRandom(ENEMY_SPEED[0], ENEMY_SPEED[1]);
};

// Player class is a subclass of the Actor class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    var sprite = 'images/char-boy.png';
    var PlayeX_Position = 202;
    var PlayerY_position = 400;
    Actor.call(this, sprite, PlayeX_Position, PlayerY_position);
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function () {
    // Determines if the player reached the water
    if (this.y < 41.5) {
        this.reset();
        score++;
        // increases the score counter
        document.getElementById('score')
            .innerHTML = '|| 🚀 Score: ' + score;
    }
    this.checkCollision();
};

// Updates the player to its starting position
Player.prototype.reset = function () {
    this.x = 202;
    this.y = 400;
};

//  Handles change in position of the player based on the keyboard input
Player.prototype.handleInput = function (direction) {
    if (direction == 'left') {
        if (this.x - BLOCK_WIDTH >= 0) //checks that player can't move off screen left
        {
            this.x -= BLOCK_WIDTH;
        }
    } else if (direction == 'up') {
        this.y -= BLOCK_HEIGHT;
    } else if (direction == 'right') //checks that player can't move off screen right
    {
        if (this.x + BLOCK_WIDTH < CANVAS_WIDTH) {
            this.x += BLOCK_WIDTH;
        }
    } else //direction down
    {
        if (this.y + BLOCK_HEIGHT <= 400) //checks that player can't move below initial screen y position
        {
            this.y += BLOCK_HEIGHT;
        }
    }
};

// Determines if the player collided with one of the enemies
Player.prototype.checkCollision = function () {
    for (var i = 0; i < allEnemies.length; i++) {
        if (Math.abs(allEnemies[i].x - this.x) <= BLOCK_WIDTH / 2 && Math.abs(allEnemies[i].y - this.y) <= BLOCK_HEIGHT / 2) {
            this.reset();
            lives -= 1;
            // update lives counter
            document.getElementById('lives')
                .innerHTML = '💚 Lives: ' + lives;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 4; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
//Adding the listener for the keys which move the player
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
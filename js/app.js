// Random number picker, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Sounds from http://soundbible.com, play when winning the game, collecting a jewel or getting hit.

const audio = new Audio('audio/slap.mp3');

const victory = new Audio('audio/yay.m4a');

const grab = new Audio('audio/ding.m4a');

// Enemies our player must avoid
const Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -50;

    // Pick a random number from an array. Code found here: https://zenscript.wordpress.com/2013/11/23/how-to-pick-a-random-entry-out-of-an-array-javascript/

    const randomNumbers = [65, 150, 225];
    const chooseRandom = function () {
        const yPosition = randomNumbers[Math.floor(Math.random() * 3)];
        return yPosition;
    };
    this.y = chooseRandom();
    this.speed = getRandomArbitrary(250, 350);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.width = 50;
    this.height = 50;
};



// Collision detection function; coding obtained from the following SO thread: https://stackoverflow.com/questions/2440377/javascript-collision-detection

Enemy.prototype.collision = function(a, b) {
        return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    if(this.x >= 600) {
        this.x = -50;
        const randomNumbers = [65, 150, 225];
        const chooseRandom = function () {
            const yPosition = randomNumbers[Math.floor(Math.random() * 3)];
            return yPosition;
        };
        this.y = chooseRandom();
        this.speed = getRandomArbitrary(100, 200);
    }

    const lose = this.collision(this, player);

    if (lose === true) {
        audio.play();
        player.steps = 0;
        $('.steps').html(player.steps);
        player.score -= 25;
        $('.score').html(player.score);
        player.x = 200;
        player.y = 400;
    }

};




// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Create a class for the jewels

let score = 0;

const jewelColors = ['images/Gem-Green.png', 'images/Gem-Orange.png', 'images/Gem-Blue.png'];

const chooseRandom = function () {
    var jewelFlavor = jewelColors[Math.floor(Math.random() * 3)];
    return jewelFlavor;
    };

const Jewel = function() {
    this.sprite = chooseRandom();
    this.x = getRandomArbitrary(50, 425);
    this.y = getRandomArbitrary(50, 250);
    this.width = 50;
    this.height = 50;
};


Jewel.prototype.pickup = function(a,b) {
        return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
};


Jewel.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Jewel.prototype.update = function() {

    const collect = this.pickup(this, player);

    if (collect === true) {
        grab.play();
        allJewels.splice(allJewels.indexOf(this), 1);
        player.score += 50;
        $('.score').html(player.score);
    }


};


Jewel.prototype.reset = function() {
    this.sprite = chooseRandom();
    this.x = getRandomArbitrary(50, 450);
    this.y = getRandomArbitrary(50, 250);
    allJewels.push(this);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

const Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
    this.width = 50;
    this.height = 50;
    this.steps = 0;
    this.score = 0;
};


Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
    this.steps = 0;
    this.score = 0;
    $('.steps').html(this.steps);
    $('.score').html(this.score);
};



Player.prototype.update = function(dt) {

    if(this.y <= 0){
        victory.play();
        alert(`Congratulations! You made it past the creepy bugs and to the water. Awesome job! It took you ${this.steps} steps, and your final score was ${this.score}!`);
        this.reset();
        allJewels.length = 0;
        jewel1.reset();
        jewel2.reset();
        jewel3.reset();
        jewel4.reset();
        jewel5.reset();
    }


};


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(x) {
    this.steps += 1;
    $('.steps').html(this.steps);
    if (x === 'left' && this.x > 0) {
        this.x = this.x - 40;
    } else if (x === 'right' && this.x != 400) {
        this.x = this.x + 40;
    } else if (x === 'up' && this.y !== 0) {
        this.y = this.y - 40;
    } else if (x === 'down' && this.y !== 400) {
        this.y = this.y + 40;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy1 = new Enemy();

const enemy2 = new Enemy();

const enemy3 = new Enemy();

const allEnemies = [];

allEnemies.push(enemy1);

allEnemies.push(enemy2);

allEnemies.push(enemy3);

const jewel1 = new Jewel();

const jewel2 = new Jewel();

const jewel3 = new Jewel();

const jewel4 = new Jewel();

const jewel5 = new Jewel();

const allJewels = [];

allJewels.push(jewel1);

allJewels.push(jewel2);

allJewels.push(jewel3);

allJewels.push(jewel4);

allJewels.push(jewel5);


const player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});



// Basic modal coding obtained here: https://www.w3schools.com/howto/howto_css_modals.asp


// Get the <span> element that closes the modal
const modal = document.getElementsByClassName("modal");

// When the user clicks on the button, open the modal
$('#charSelect').on('click', function() {
    $(".modal").css( "display", "block" );
});



$('.close').on('click', function() {
    $(".modal").css( "display", "none" );
});


// Select character, then close the modal and reset the game


$('#charOne').on('click', function() {
    player.sprite = "images/char-boy.png";
    player.reset();
    allJewels.length = 0;
    jewel1.reset();
    jewel2.reset();
    jewel3.reset();
    jewel4.reset();
    jewel5.reset();
    $(".modal").css( "display", "none" );
});

$('#charTwo').on('click', function() {
    player.sprite = "images/char-cat-girl.png";
    player.reset();
    allJewels.length = 0;
    jewel1.reset();
    jewel2.reset();
    jewel3.reset();
    jewel4.reset();
    jewel5.reset();
    $(".modal").css( "display", "none" );
});

$('#charThree').on('click', function() {
    player.sprite = "images/char-horn-girl.png";
    player.reset();
    allJewels.length = 0;
    jewel1.reset();
    jewel2.reset();
    jewel3.reset();
    jewel4.reset();
    jewel5.reset();
    $(".modal").css( "display", "none" );
});

$('#charFour').on('click', function() {
    player.sprite = "images/char-pink-girl.png";
    player.reset();
    allJewels.length = 0;
    jewel1.reset();
    jewel2.reset();
    jewel3.reset();
    jewel4.reset();
    jewel5.reset();
    $(".modal").css( "display", "none" );
});

$('#charFive').on('click', function() {
    player.sprite = "images/char-princess-girl.png";
    player.reset();
    allJewels.length = 0;
    jewel1.reset();
    jewel2.reset();
    jewel3.reset();
    jewel4.reset();
    jewel5.reset();
    $(".modal").css( "display", "none" );
});

window.onclick = function(event) {
    if (event.target === modal) {
        $(".modal").css( "display", "none" );
    }
};


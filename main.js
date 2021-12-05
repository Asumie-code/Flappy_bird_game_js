const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let ref;

// generate random integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}




// game score 

class Score {
    constructor(color) {
        this.value = 0;
        this.color = color;
    }

    render() {
        ctx.font = '16px Arial ';
        ctx.fillStyle = this.color;
        ctx.fillText(`Score: ${this.value}`, 8, 20);
    }
}


// handle game controls 

class Controls {
    constructor() {
        this.mouseClicked = false;

    }

    attachEvent() {
        canvas.addEventListener('mousedown', this.mouseEventHandler, false)
        canvas.addEventListener('mouseup', this.mouseEventHandler, false)

    }

    mouseEventHandler = () => {
        if (this.mouseClicked) {
            this.mouseClicked = false;
        } else {
            this.mouseClicked = true;
        }
    }
}



// game obstacles 

class Brick {
    constructor(x, vx, w, h, random, color) {
        this.h = h;
        this.w = w;
        this.x = x;
        this.vx = vx;
        this.y = 0;
        this.bottom = canvas.height - this.h;
        this.random = random;
        this.top = 0;
        this.color = color;

    }



    move() {
        this.x -= 2 * this.vx;
    }

    render() {

        if (this.random === 1) {
            this.y = this.bottom;
        } else {
            this.y = this.top;
        }

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

    }
}


// game playable component 

class Player {
    constructor(x, y, vy, h, w, color, control) {
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.h = h;
        this.w = w;
        this.color = color;
        this.control = control;

    }

    gravity() {
        this.y += 2 * this.vy;
    }

    lift() {
        if (this.control.mouseClicked) {
            this.y -= 3.5 * this.vy;
        }
    }

    // collision detection and game over logic 

    collision(brick) {
        if (this.y > canvas.height - this.h || this.y < 0) {
            return true;

        } else if (((this.y + this.h > brick.y) && (this.x + this.w > brick.x) && (this.x + this.w < brick.x + brick.w) && (this.y < brick.y + brick.h))){
            return true
        } else {
            return false;

        }


    }



    render() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}



let score = new Score('green');
let control = new Controls();
let player = new Player(100, 200, 1, 10, 10, 'green', control);
let bricks = [];

// inital bricks use loop to add more to the screen 

bricks.push(new Brick(canvas.width , 1, 30, 200 + getRandomInt(50), getRandomInt(2), 'blue'));



// draw everything on screen 


function render() {
    // collision is evaluated on the first brick later this brick is destroyed and the next brick will have it's collision evaluated.
    let collision = player.collision(bricks[0]); 

    if (collision) {

        ctx.font = '20px Arial ';
        ctx.fillStyle = 'red';
        ctx.fillText(`game over your score is : ${score.value}`, 90, 100);
        cancelAnimationFrame(ref);

    } else {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        control.attachEvent();
        score.render();
        player.render();
        player.gravity();
        player.lift();


        // add and remove bricks to the screen 

        for (let brick of bricks) {

            brick.render();
            brick.move();
        }

        if (bricks[0].x + bricks[0].w < 0) {
            bricks.push(new Brick(canvas.width , 1, 30, 200 + getRandomInt(50), getRandomInt(2), 'blue'));
            score.value++;
            bricks.shift();
        }

    }

    
    ref = requestAnimationFrame(render);
}


render();
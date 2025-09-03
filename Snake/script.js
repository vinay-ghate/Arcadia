// Game state and settings
const GRID_SIZE = 20;
let snake, food, bonusFood;
let score, highScore;
let scl;
let gameState = 'initial'; // 'initial', 'playing', 'paused', 'gameOver'
let bonusFoodTimer;
let isGameInitialized = false;

// DOM Elements
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over-screen');
const speedSlider = document.getElementById('speed-slider');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');

// p5.js setup function - runs once
function setup() {
    const gameBoard = document.getElementById('game-board');
    // Create a tiny 1x1 placeholder canvas. The ResizeObserver will correct it.
    const canvas = createCanvas(1, 1);
    canvas.parent('game-board');

    // --- The Final Fix: Use ResizeObserver for guaranteed accurate sizing ---
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            // contentBoxSize gives the true inner dimensions, excluding border/padding.
            const newSize = entry.contentBoxSize[0].inlineSize;
            
            resizeCanvas(newSize, newSize);
            scl = width / GRID_SIZE;

            // Initialize the game's objects only after we have a valid size.
            if (!isGameInitialized) {
                initializeGame();
                isGameInitialized = true;
            }
        }
    });

    // Start observing the game board element for any size changes.
    resizeObserver.observe(gameBoard);

    frameRate(parseInt(speedSlider.value));
    highScore = localStorage.getItem('snake-highscore') || 0;
    highScoreEl.innerText = highScore;
    
    setupControls();
    updateButtonStates(); // Set initial button state
}

// p5.js draw function - runs in a loop
function draw() {
    background('#111827');

    // Don't draw anything until the game has been initialized by the ResizeObserver
    if (!isGameInitialized) return;

    if (gameState === 'playing') {
        handleBonusFood();
        if (snake.eat(food)) {
            updateScore(1);
            food.pickLocation();
        }
        if (bonusFood.active && snake.eat(bonusFood)) {
            updateScore(10);
            bonusFood.active = false;
        }
        snake.update();
        snake.checkDeath();
    }
    
    food.show();
    if (bonusFood.active) {
        bonusFood.show();
    }
    snake.show();
}

function initializeGame() {
    score = 0;
    scoreEl.innerText = score;
    snake = new Snake();
    food = new Food();
    bonusFood = new BonusFood();
    
    food.pickLocation();
    
    gameOverScreen.classList.remove('show');
    
    // If restarting, set state to playing, otherwise it stays 'initial'
    if (gameState === 'gameOver') {
        setGameState('playing');
    }
}

function updateButtonStates() {
    switch (gameState) {
        case 'playing':
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            pauseBtn.innerText = 'PAUSE';
            break;
        case 'paused':
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            pauseBtn.innerText = 'RESUME';
            break;
        case 'gameOver':
            startBtn.disabled = false;
            startBtn.innerText = 'RESTART';
            pauseBtn.disabled = true;
            pauseBtn.innerText = 'PAUSE';
            break;
        case 'initial':
            startBtn.disabled = false;
            startBtn.innerText = 'START';
            pauseBtn.disabled = true;
            pauseBtn.innerText = 'PAUSE';
            break;
    }
}

function setGameState(newState) {
    gameState = newState;
    updateButtonStates();
}

function togglePause() {
    if (gameState === 'playing') {
        setGameState('paused');
    } else if (gameState === 'paused') {
        setGameState('playing');
    }
}

function updateScore(points) {
    score += points;
    scoreEl.innerText = score;
    if (score > highScore) {
        highScore = score;
        highScoreEl.innerText = highScore;
        localStorage.setItem('snake-highscore', highScore);
    }
    if (score > 0 && score % 5 === 0 && points === 1) {
        bonusFood.activate();
    }
}

function handleBonusFood() {
    if (bonusFood.active && millis() > bonusFoodTimer) {
        bonusFood.active = false;
    }
}

function keyPressed() {
    if (gameState !== 'playing') return;
    if (keyCode === UP_ARROW) snake.dir(0, -1);
    else if (keyCode === DOWN_ARROW) snake.dir(0, 1);
    else if (keyCode === RIGHT_ARROW) snake.dir(1, 0);
    else if (keyCode === LEFT_ARROW) snake.dir(-1, 0);
}

function setupControls() {
    startBtn.addEventListener('click', () => {
        if (gameState === 'initial' || gameState === 'gameOver') {
            setGameState('playing');
            initializeGame();
        }
    });
    pauseBtn.addEventListener('click', togglePause);
    
    document.getElementById('up-btn').addEventListener('click', () => snake.dir(0, -1));
    document.getElementById('down-btn').addEventListener('click', () => snake.dir(0, 1));
    document.getElementById('left-btn').addEventListener('click', () => snake.dir(-1, 0));
    document.getElementById('right-btn').addEventListener('click', () => snake.dir(1, 0));

    speedSlider.addEventListener('input', (e) => {
        frameRate(parseInt(e.target.value));
    });
}

// ---- Game Object Classes ----

class Snake {
    constructor() {
        this.body = [createVector(floor(GRID_SIZE / 2), floor(GRID_SIZE / 2))];
        this.xSpeed = 0; this.ySpeed = 0; this.isGrowing = false;
    }
    dir(x, y) {
        if (this.body.length > 1 && this.xSpeed === -x && this.ySpeed === -y) return;
        this.xSpeed = x; this.ySpeed = y;
    }
    update() {
        const head = this.body[this.body.length - 1].copy();
        if (!this.isGrowing) this.body.shift();
        this.isGrowing = false;
        head.x += this.xSpeed; head.y += this.ySpeed;
        this.body.push(head);
    }
    eat(pos) {
        const head = this.body[this.body.length - 1];
        if (head.x === pos.x && head.y === pos.y) {
            this.isGrowing = true; return true;
        }
        return false;
    }
    checkDeath() {
        const head = this.body[this.body.length - 1];
        if (head.x >= GRID_SIZE || head.x < 0 || head.y >= GRID_SIZE || head.y < 0) {
            setGameState('gameOver');
            gameOverScreen.classList.add('show');
        }
        for (let i = 0; i < this.body.length - 1; i++) {
            if (this.body[i].equals(head)) {
                setGameState('gameOver');
                gameOverScreen.classList.add('show');
            }
        }
    }
    show() {
        noStroke();
        for (let i = 0; i < this.body.length; i++) {
            fill(i === this.body.length - 1 ? '#5ce68f' : '#38e07b');
            rect(this.body[i].x * scl, this.body[i].y * scl, scl, scl, 4);
        }
    }
}

class Food {
    constructor() { this.x = 0; this.y = 0; }
    pickLocation() {
        let validLocation = false;
        while (!validLocation) {
            this.x = floor(random(GRID_SIZE)); this.y = floor(random(GRID_SIZE));
            validLocation = !snake.body.some(part => part.x === this.x && part.y === this.y);
        }
    }
    show() {
        fill('#ef4444'); noStroke();
        rect(this.x * scl, this.y * scl, scl, scl, 8);
    }
}

class BonusFood extends Food {
    constructor() { super(); this.active = false; }
    activate() {
        this.active = true; this.pickLocation();
        bonusFoodTimer = millis() + 3000;
    }
    show() {
        const alpha = map(sin(frameCount * 0.3), -1, 1, 150, 255);
        fill(251, 191, 36, alpha); noStroke();
        rect(this.x * scl, this.y * scl, scl, scl, 12);
    }
}
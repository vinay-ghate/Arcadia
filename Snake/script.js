document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const startText = document.getElementById('start-text');
    const gameOverText = document.getElementById('game-over-text');
    const finalScoreDisplay = document.getElementById('final-score');
    const pauseButton = document.getElementById('pause-button');
    const speedSlider = document.getElementById('speed-slider');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const fullscreenPrompt = document.getElementById('fullscreen-prompt');
    const orientationLock = document.getElementById('orientation-lock');
    
    // --- Game Settings ---
    const GRID_SIZE = 21;
    let gameSpeed = 150; 
    let gameInterval;

    // --- Game State ---
    let snake = [{ x: 11, y: 11 }];
    let food = generateFood();
    let direction = { x: 0, y: 0 };
    let nextDirection = { x: 0, y: 0 };
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let isGameOver = false;
    let isGameStarted = false;
    let isPaused = false;
    
    highScoreDisplay.textContent = highScore;
    board.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;
    board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

    function main() {
        if (isGameOver) {
            clearInterval(gameInterval);
            finalScoreDisplay.textContent = score;
            gameOverText.classList.remove('hidden');
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                highScoreDisplay.textContent = highScore;
            }
            return;
        }
        update();
        draw();
    }

    function update() {
        if (isPaused) return;

        // *** THIS IS THE FIX ***
        // The snake's direction is now updated at the START of the game tick.
        // This removes the one-frame input lag.
        direction = nextDirection;

        if (direction.x === 0 && direction.y === 0) return;

        const head = { ...snake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (isCollision(head)) {
            isGameOver = true;
            return;
        }
        
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = score;
            food = generateFood();
        } else {
            snake.pop();
        }
    }

    function draw() {
        board.innerHTML = ''; 
        drawSnake();
        drawFood();
    }
    
    function drawSnake() {
        snake.forEach((segment, index) => {
            const snakeElement = createGameElement('div', 'snake');
            if(index === 0) snakeElement.classList.add('head');
            setPosition(snakeElement, segment);
            board.appendChild(snakeElement);
        });
    }

    function drawFood() {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
    
    function createGameElement(tag, className) {
        const element = document.createElement(tag);
        element.className = className;
        return element;
    }

    function setPosition(element, position) {
        element.style.gridColumnStart = position.x;
        element.style.gridRowStart = position.y;
    }
    
    function generateFood() {
        let newFoodPosition;
        while (newFoodPosition == null || onSnake(newFoodPosition)) {
            newFoodPosition = {
                x: Math.floor(Math.random() * GRID_SIZE) + 1,
                y: Math.floor(Math.random() * GRID_SIZE) + 1,
            };
        }
        return newFoodPosition;
    }
    
    function onSnake(position) {
        return snake.some(segment => segment.x === position.x && segment.y === position.y);
    }
    
    function isCollision(head) {
        if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) return true;
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) return true;
        }
        return false;
    }
    
    function startGame() {
        if (isGameStarted && !isGameOver) return;
        if (isGameOver) {
            resetGame();
        }
        isGameStarted = true;
        startText.style.display = 'none';
        isPaused = false;
        pauseButton.textContent = 'PAUSE';
        direction = nextDirection;
        clearInterval(gameInterval);
        gameInterval = setInterval(main, gameSpeed);
    }
    
    function togglePause() {
        if (!isGameStarted || isGameOver) return;
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'RESUME' : 'PAUSE';
    }

    function resetGame() {
        snake = [{ x: 11, y: 11 }];
        food = generateFood();
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        score = 0;
        scoreDisplay.textContent = score;
        isGameOver = false;
        isGameStarted = false;
        isPaused = false;
        gameOverText.classList.add('hidden');
        startText.style.display = 'flex';
        pauseButton.textContent = 'PAUSE';
        draw(); 
    }

    // --- Event Listeners ---
    document.addEventListener('keydown', e => {
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            togglePause();
            return;
        }

        let newDirection;
        switch (e.key) {
            case 'ArrowUp': newDirection = { x: 0, y: -1 }; break;
            case 'ArrowDown': newDirection = { x: 0, y: 1 }; break;
            case 'ArrowLeft': newDirection = { x: -1, y: 0 }; break;
            case 'ArrowRight': newDirection = { x: 1, y: 0 }; break;
            default: return;
        }
        // This check correctly uses the 'direction' from the previous frame to prevent 180-degree turns.
        if (isGameStarted && (newDirection.x === -direction.x && newDirection.y === -direction.y)) return;
        
        nextDirection = newDirection;
        
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault(); 
            startGame();
        }
    });

    document.getElementById('controls').addEventListener('click', e => {
        const button = e.target.closest('button[data-key]');
        if (button) {
            document.dispatchEvent(new KeyboardEvent('keydown', { 'key': button.dataset.key }));
        }
    });
    
    gameOverText.addEventListener('click', resetGame);

    pauseButton.addEventListener('click', togglePause);
    
    speedSlider.addEventListener('input', (e) => {
        gameSpeed = 300 - e.target.value;
        if (isGameStarted && !isPaused) {
            clearInterval(gameInterval);
            gameInterval = setInterval(main, gameSpeed);
        }
    });

    // --- Mobile Full Screen & Orientation ---
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    function enterFullScreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        }
    }
    function checkOrientation() {
        if (!isMobile) return;
        
        if (window.innerHeight > window.innerWidth) { // Portrait
            mobileOverlay.style.display = 'flex';
            fullscreenPrompt.style.display = 'none';
            orientationLock.style.display = 'block';
        } else { // Landscape
            mobileOverlay.style.display = 'none';
        }
    }
    if (isMobile) {
        mobileOverlay.style.display = 'flex';
        fullscreenPrompt.style.display = 'block';
        orientationLock.style.display = 'none';
        
        fullscreenPrompt.addEventListener('click', () => {
            enterFullScreen();
            checkOrientation();
        }, { once: true });

        window.addEventListener('resize', checkOrientation);
    }
});
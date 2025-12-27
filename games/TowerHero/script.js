document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    // Elements handled by GameManager now, but we might need to hook into them or let GameManager handle them completely.
    // Ideally, we remove manual score/message elements and use GameManager's UI.

    const BLOCK_HEIGHT = 25;
    const INITIAL_BLOCK_WIDTH = 150;
    const PERFECT_THRESHOLD = 2;

    let tower, activeBlock, droppedPiece;
    let score, bestScore;
    let gameState;
    let cameraY;
    let craneSpeed, cranePhase;
    let animationFrameId = null;

    const blockColors = ['#f8b195', '#f67280', '#c06c84', '#6c5b7b', '#355c7d'];

    // --- GameManager Init ---
    const gameManager = new GameManager({
        gameId: 'tower-hero',
        title: 'Tower Hero',
        scoreType: 'points',
        onRestart: () => {
            init();
        }
    });

    function init() {
        // FIX: Cancel any existing animation loop to ensure a clean restart.
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // bestScore is handled by GameManager internally, but if we want to display it manually we can.
        // But GameManager has showBestScore: true by default.
        // We'll let GameManager handle the score display.

        gameManager.resetScore();
        score = 0;
        cameraY = 0;
        gameState = 'waiting';
        craneSpeed = 0.03;
        cranePhase = Math.random() * Math.PI * 2;

        const baseBlock = {
            x: (canvas.width / 2) - (INITIAL_BLOCK_WIDTH / 2),
            y: canvas.height - BLOCK_HEIGHT * 3,
            width: INITIAL_BLOCK_WIDTH,
            height: BLOCK_HEIGHT * 3,
            color: '#34495e'
        };
        tower = [baseBlock];

        spawnNewBlock();

        gameManager.hideGameOver();
        // We can use a custom start message or just let the user click to start.
        // The original had a message "Click to Start".
        // We can draw this on canvas or use a simple overlay.
        // For now, let's just start the loop and let the first click start the game.

        gameLoop(); // Start the game loop
    }

    function gameLoop() {
        update();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function update() {
        if (gameState === 'gameOver') return;

        // Move the active block (crane)
        if (!activeBlock.isFalling) {
            cranePhase += craneSpeed;
            const swingRange = canvas.width / 2 - activeBlock.width / 2 - 20;
            activeBlock.x = canvas.width / 2 - activeBlock.width / 2 + Math.sin(cranePhase) * swingRange;
        }

        // Move the falling block only when playing
        if (activeBlock.isFalling && gameState === 'playing') {
            activeBlock.y += 5; // Gravity

            const topBlock = tower[tower.length - 1];
            if (activeBlock.y >= topBlock.y - BLOCK_HEIGHT) {
                placeBlock();
            }
        }

        if (droppedPiece) {
            droppedPiece.y += 5;
            droppedPiece.rotation += droppedPiece.rotationSpeed;
            if (droppedPiece.y > canvas.height + cameraY) {
                droppedPiece = null;
            }
        }

        const targetCameraY = tower.length * BLOCK_HEIGHT - canvas.height / 1.5;
        cameraY += (targetCameraY - cameraY) * 0.1;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(0, -cameraY);

        tower.forEach(block => {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
        });

        if (gameState !== 'gameOver') {
            ctx.fillStyle = activeBlock.color;
            ctx.fillRect(activeBlock.x, activeBlock.y, activeBlock.width, activeBlock.height);
        }

        if (droppedPiece) {
            ctx.save();
            ctx.translate(droppedPiece.x + droppedPiece.width / 2, droppedPiece.y + droppedPiece.height / 2);
            ctx.rotate(droppedPiece.rotation);
            ctx.fillStyle = droppedPiece.color;
            ctx.fillRect(-droppedPiece.width / 2, -droppedPiece.height / 2, droppedPiece.width, droppedPiece.height);
            ctx.restore();
        }

        ctx.restore();

        // Draw "Click to Start" if waiting
        if (gameState === 'waiting') {
            ctx.fillStyle = 'white';
            ctx.font = '30px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
        }
    }

    function spawnNewBlock() {
        const topBlock = tower[tower.length - 1];
        const newY = topBlock.y - canvas.height / 2.5;

        activeBlock = {
            x: canvas.width / 2,
            y: Math.min(newY, topBlock.y - BLOCK_HEIGHT * 5),
            width: topBlock.width,
            height: BLOCK_HEIGHT,
            isFalling: false,
            color: blockColors[(tower.length - 1) % blockColors.length]
        };
    }

    function placeBlock() {
        const topBlock = tower[tower.length - 1];
        const newBlock = activeBlock;

        const overlap = Math.max(0, Math.min(newBlock.x + newBlock.width, topBlock.x + topBlock.width) - Math.max(newBlock.x, topBlock.x));

        if (overlap <= 0) {
            gameOver();
            return;
        }

        const overhang = newBlock.width - overlap;
        if (overhang < PERFECT_THRESHOLD) {
            newBlock.x = topBlock.x;
            newBlock.width = topBlock.width;
            showPerfectText();
        } else {
            const newWidth = overlap;
            const newX = Math.max(newBlock.x, topBlock.x);

            const droppedWidth = newBlock.width - overlap;
            const droppedX = newBlock.x < topBlock.x ? newBlock.x : newX + overlap;
            droppedPiece = {
                x: droppedX,
                y: topBlock.y - BLOCK_HEIGHT,
                width: droppedWidth,
                height: BLOCK_HEIGHT,
                color: newBlock.color,
                rotation: 0,
                rotationSpeed: newBlock.x < topBlock.x ? -0.1 : 0.1
            };

            newBlock.width = newWidth;
            newBlock.x = newX;
        }

        newBlock.y = topBlock.y - BLOCK_HEIGHT;

        tower.push(newBlock);
        updateScore(1);
        spawnNewBlock();
    }

    function dropBlock() {
        if (gameState === 'playing' && !activeBlock.isFalling) {
            activeBlock.isFalling = true;
        }
    }

    function updateScore(points) {
        score += points;
        gameManager.addScore(points);
    }

    function showPerfectText() {
        const topBlock = tower[tower.length - 1];
        // We can use a DOM element for this or draw on canvas.
        // Let's use a DOM element created dynamically or existing one.
        let perfectIndicatorEl = document.getElementById('perfect-indicator');
        if (!perfectIndicatorEl) {
            perfectIndicatorEl = document.createElement('div');
            perfectIndicatorEl.id = 'perfect-indicator';
            perfectIndicatorEl.className = 'perfect-text';
            perfectIndicatorEl.textContent = 'Perfect!';
            document.body.appendChild(perfectIndicatorEl);
        }

        perfectIndicatorEl.style.left = `${topBlock.x + topBlock.width / 2}px`;
        perfectIndicatorEl.style.top = `${topBlock.y - cameraY - 40}px`;
        perfectIndicatorEl.classList.add('show');
        setTimeout(() => {
            perfectIndicatorEl.classList.remove('show');
        }, 500);
    }

    function gameOver() {
        gameState = 'gameOver';
        gameManager.showGameOver();
    }

    function handleInput() {
        switch (gameState) {
            case 'waiting':
                gameState = 'playing';
                dropBlock(); // Drop the block on the first click
                break;
            case 'playing':
                dropBlock();
                break;
            case 'gameOver':
                // handled by GameManager restart button
                break;
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Might need to re-center tower or something, but simple resize is okay for now
    });

    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput();
    });

    init();
});

// script.js (FINAL VERSION)

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gridElement = document.getElementById('tetris-grid');
    const scoreDisplay = document.getElementById('score-display');
    const linesDisplay = document.getElementById('lines-display');
    const nextPieceGridElement = document.getElementById('next-piece-grid');
    const pauseOverlay = document.getElementById('pause-overlay');
    const pauseBtn = document.getElementById('pause-btn');

    // --- Game Constants ---
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;

    const cells = Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, () => {
        const cell = document.createElement('div');
        cell.classList.add('tetris-cell');
        gridElement.appendChild(cell);
        return cell;
    });
    
    // NEW: Create cells for the 'Next' piece preview box
    const nextCells = Array.from({ length: 16 }, () => {
        const cell = document.createElement('div');
        cell.classList.add('tetris-cell');
        nextPieceGridElement.appendChild(cell);
        return cell;
    });

    // --- Tetromino Definitions ---
    const TETROMINOES = {
        'i': { shape: [[1, 1, 1, 1]], color: 'i' },
        'l': { shape: [[0, 0, 1], [1, 1, 1]], color: 'l' },
        'j': { shape: [[1, 0, 0], [1, 1, 1]], color: 'j' },
        's': { shape: [[0, 1, 1], [1, 1, 0]], color: 's' },
        'z': { shape: [[1, 1, 0], [0, 1, 1]], color: 'z' },
        'o': { shape: [[1, 1], [1, 1]], color: 'o' },
        't': { shape: [[0, 1, 0], [1, 1, 1]], color: 't' },
    };
    const PIECE_TYPES = 'iljszot';

    // --- Game State ---
    let arena = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null));
    let player = { pos: { x: 0, y: 0 }, tetromino: null };
    let score = 0;
    let lines = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let dropCounter = 0;
    let isGameOver = false;
    let isPaused = false; // NEW: Pause state
    let nextPiece = null; // NEW: Next piece state

    // --- Functions ---

    function createPiece(type) {
        const piece = TETROMINOES[type];
        return { shape: piece.shape.map(row => [...row]), color: piece.color };
    }
    
    function generateNewPiece() {
        const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
        return createPiece(type);
    }

    function playerReset() {
        player.tetromino = nextPiece; // The next piece becomes the current piece
        nextPiece = generateNewPiece(); // Generate a new piece for the preview
        player.pos.x = Math.floor(GRID_WIDTH / 2) - Math.floor(player.tetromino.shape[0].length / 2);
        player.pos.y = 0;

        if (checkCollision()) {
            isGameOver = true;
            alert(`Game Over! Final Score: ${score}`);
        }
    }

    function checkCollision() {
        for (let y = 0; y < player.tetromino.shape.length; y++) {
            for (let x = 0; x < player.tetromino.shape[y].length; x++) {
                if (
                    player.tetromino.shape[y][x] &&
                    (arena[y + player.pos.y] && arena[y + player.pos.y][x + player.pos.x]) !== null
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function mergeIntoArena() {
        player.tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    arena[y + player.pos.y][x + player.pos.x] = player.tetromino.color;
                }
            });
        });
    }

    function clearLines() {
        let clearedLines = 0;
        outer: for (let y = arena.length - 1; y >= 0; y--) {
            for (let x = 0; x < arena[y].length; x++) {
                if (arena[y][x] === null) continue outer;
            }
            const row = arena.splice(y, 1)[0].fill(null);
            arena.unshift(row);
            y++;
            clearedLines++;
        }
        if (clearedLines > 0) {
            score += Math.pow(clearedLines, 2) * 10;
            lines += clearedLines;
        }
    }

    // --- Drawing ---

    function draw() {
        // Draw main grid
        cells.forEach(cell => cell.className = 'tetris-cell');
        arena.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    cells[y * GRID_WIDTH + x].classList.add('filled', color);
                }
            });
        });
        player.tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const index = (y + player.pos.y) * GRID_WIDTH + (x + player.pos.x);
                    if (index < cells.length) {
                        cells[index].classList.add('filled', player.tetromino.color);
                    }
                }
            });
        });

        // NEW: Draw the next piece in its own grid
        nextCells.forEach(cell => cell.className = 'tetris-cell');
        const shape = nextPiece.shape;
        const offset = { x: Math.floor((4 - shape[0].length) / 2), y: Math.floor((4 - shape.length) / 2) };
        shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const index = (y + offset.y) * 4 + (x + offset.x);
                    nextCells[index].classList.add('filled', nextPiece.color);
                }
            });
        });
    }
    
    // --- Player Movement & Game Logic ---
    function move(direction) {
        player.pos.x += direction;
        if (checkCollision()) player.pos.x -= direction;
    }
    function rotate() {
        const shape = player.tetromino.shape;
        const newShape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
        const originalX = player.pos.x;
        player.tetromino.shape = newShape;
        let offset = 1;
        while (checkCollision()) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > newShape[0].length) {
                player.tetromino.shape = shape;
                player.pos.x = originalX;
                return;
            }
        }
    }
    function drop() {
        player.pos.y++;
        if (checkCollision()) {
            player.pos.y--;
            mergeIntoArena();
            clearLines();
            playerReset();
        }
        dropCounter = 0;
    }

    // NEW: Pause Function
    function togglePause() {
        isPaused = !isPaused;
        pauseOverlay.classList.toggle('hidden', !isPaused);
        if (!isPaused) {
            update(); // Resume the game loop
        }
    }
    
    // --- Game Loop ---
    function update(time = 0) {
        if (isGameOver || isPaused) return; // Stop loop if paused or game over
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) drop();
        draw();
        scoreDisplay.textContent = score;
        linesDisplay.textContent = lines;
        requestAnimationFrame(update);
    }

    // --- Event Listeners ---
    document.addEventListener('keydown', (e) => {
        if (isGameOver || isPaused) return;
        if (e.key === 'ArrowLeft') move(-1);
        else if (e.key === 'ArrowRight') move(1);
        else if (e.key === 'ArrowDown') drop();
        else if (e.key === 'ArrowUp') rotate();
    });

    pauseBtn.addEventListener('click', togglePause);

    // --- Start Game ---
    nextPiece = generateNewPiece(); // Generate the first 'next' piece
    playerReset(); // Load it into the game
    update();
});
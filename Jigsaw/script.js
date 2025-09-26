document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const fullscreenButton = document.getElementById('fullscreen-button');
    const imageSelect = document.getElementById('image-select');
    const difficultySelect = document.getElementById('difficulty-select');
    const startButton = document.getElementById('start-button');
    const boardContainer = document.getElementById('board-container');
    const moveCounter = document.getElementById('move-counter');
    const timerDisplay = document.getElementById('timer');
    const winModal = document.getElementById('win-modal');
    const winTime = document.getElementById('win-time');
    const winMoves = document.getElementById('win-moves');
    const playAgainButton = document.getElementById('play-again-button');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // --- Game State ---
    let difficulty, imageSrc, moves, timerInterval, seconds, isGameActive = false;
    let pieces = [];

    // --- Fullscreen Logic ---
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    document.addEventListener('fullscreenchange', () => {
        fullscreenButton.textContent = document.fullscreenElement ? 'Exit' : 'Fullscreen';
    });
    
    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', () => {
        winModal.style.display = 'none';
        startGame();
    });
    fullscreenButton.addEventListener('click', toggleFullscreen);

    // --- Game Logic ---
    function startGame() {
        difficulty = parseInt(difficultySelect.value);
        imageSrc = imageSelect.value;
        
        resetGame();
        loadingOverlay.style.display = 'flex';

        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            requestAnimationFrame(() => {
                setupBoardAndPieces(image);
                scrambleBoard();
                isGameActive = true;
                loadingOverlay.style.display = 'none';
            });
        };
    }
    
    function resetGame() {
        clearInterval(timerInterval);
        isGameActive = false;
        seconds = 0; moves = 0;
        timerDisplay.textContent = '00:00';
        moveCounter.textContent = '0';
        boardContainer.innerHTML = '';
        winModal.style.display = 'none';
        pieces = [];
    }

    function setupBoardAndPieces(image) {
        // Create an array to hold pieces with their correct and current positions
        for (let i = 0; i < difficulty * difficulty; i++) {
            const row = Math.floor(i / difficulty);
            const col = i % difficulty;
            pieces.push({ correctRow: row, correctCol: col, currentRow: row, currentCol: col, element: null });
        }

        // Set up board sizing
        const boardWrapper = document.querySelector('.board-wrapper');
        const boardSize = boardWrapper.clientWidth;
        boardContainer.style.width = `${boardSize}px`;
        boardContainer.style.height = `${boardSize}px`;
        boardContainer.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
        boardContainer.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

        const pieceSize = boardSize / difficulty;

        // Create piece elements
        pieces.forEach((p, i) => {
            // The last piece is the empty slot
            if (i === pieces.length - 1) return;

            const pieceElement = document.createElement('div');
            pieceElement.classList.add('puzzle-piece');
            p.element = pieceElement;

            pieceElement.style.backgroundImage = `url(${image.src})`;
            pieceElement.style.backgroundSize = `${boardSize}px ${boardSize}px`;
            pieceElement.style.backgroundPosition = `-${p.correctCol * pieceSize}px -${p.correctRow * pieceSize}px`;
            
            pieceElement.addEventListener('click', () => onPieceClick(p));
        });

        // Draw the board in its solved state initially
        drawBoard();
    }

    function drawBoard() {
        boardContainer.innerHTML = '';
        const grid = Array(difficulty * difficulty).fill(null);
        
        pieces.forEach(p => {
            if (p.element) {
                const index = p.currentRow * difficulty + p.currentCol;
                grid[index] = p.element;
            }
        });

        for (let i = 0; i < difficulty * difficulty; i++) {
            const slot = document.createElement('div');
            slot.classList.add('board-slot');
            if (grid[i]) {
                slot.appendChild(grid[i]);
            }
            boardContainer.appendChild(slot);
        }
    }

    function onPieceClick(clickedPiece) {
        if (!isGameActive) return;
        
        // Find the empty slot
        const emptySlot = pieces.find(p => !p.element);

        // Check for adjacency
        const isAdjacent = (clickedPiece.currentRow === emptySlot.currentRow && Math.abs(clickedPiece.currentCol - emptySlot.currentCol) === 1) ||
                           (clickedPiece.currentCol === emptySlot.currentCol && Math.abs(clickedPiece.currentRow - emptySlot.currentRow) === 1);

        if (isAdjacent) {
            // Swap positions
            [emptySlot.currentRow, clickedPiece.currentRow] = [clickedPiece.currentRow, emptySlot.currentRow];
            [emptySlot.currentCol, clickedPiece.currentCol] = [clickedPiece.currentCol, emptySlot.currentCol];
            
            moves++;
            moveCounter.textContent = moves;
            
            drawBoard();
            checkWinCondition();
        }
    }

    function scrambleBoard() {
        const emptySlot = pieces.find(p => !p.element);
        
        for (let i = 0; i < difficulty * difficulty * 10; i++) {
            const neighbors = pieces.filter(p => {
                return (p.currentRow === emptySlot.currentRow && Math.abs(p.currentCol - emptySlot.currentCol) === 1) ||
                       (p.currentCol === emptySlot.currentCol && Math.abs(p.currentRow - emptySlot.currentRow) === 1);
            });
            
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            // Swap positions
            [emptySlot.currentRow, randomNeighbor.currentRow] = [randomNeighbor.currentRow, emptySlot.currentRow];
            [emptySlot.currentCol, randomNeighbor.currentCol] = [randomNeighbor.currentCol, emptySlot.currentCol];
        }
        drawBoard();
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            timerDisplay.textContent = `${min}:${sec}`;
        }, 1000);
    }
    
    
    function checkWinCondition() {
        const isWin = pieces.every(p => p.currentRow === p.correctRow && p.currentCol === p.correctCol);
        if (isWin) {
            // Put the last piece back in place
            const lastPiece = pieces.find(p => !p.element);
            const finalPieceElement = lastPiece.element; // This needs to be created on setup
            // For simplicity, we just declare a win
            
            isGameActive = false;
            clearInterval(timerInterval);
            winTime.textContent = timerDisplay.textContent;
            winMoves.textContent = moves;
            winModal.style.display = 'flex';
        }
    }
    
    // --- Initialize ---
    startGame();
});
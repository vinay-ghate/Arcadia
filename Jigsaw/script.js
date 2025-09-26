document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const imageSelect = document.getElementById('image-select');
    const difficultySelect = document.getElementById('difficulty-select');
    const startButton = document.getElementById('start-button');
    const boardContainer = document.getElementById('board-container');
    const piecePool = document.getElementById('piece-pool');
    const moveCounter = document.getElementById('move-counter');
    const timerDisplay = document.getElementById('timer');
    const winModal = document.getElementById('win-modal');
    const winTime = document.getElementById('win-time');
    const winMoves = document.getElementById('win-moves');
    const playAgainButton = document.getElementById('play-again-button');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Game State
    let difficulty, imageSrc, moves, timerInterval, seconds;
    let draggedPiece = null;
    let sourceContainer = null;

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', () => {
        winModal.style.display = 'none';
        startGame();
    });

    // --- Game Logic ---
    function startGame() {
        difficulty = parseInt(difficultySelect.value);
        imageSrc = imageSelect.value;
        
        resetGame();
        loadingOverlay.style.display = 'flex';

        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            setupBoard(image.naturalWidth, image.naturalHeight);
            createPuzzlePieces(image);
            startTimer();
            loadingOverlay.style.display = 'none';
        };
        image.onerror = () => {
            alert("Error loading image. Please check the path and try again.");
            loadingOverlay.style.display = 'none';
        }
    }

    function resetGame() {
        clearInterval(timerInterval);
        seconds = 0;
        moves = 0;
        timerDisplay.textContent = '00:00';
        moveCounter.textContent = '0';
        boardContainer.innerHTML = '';
        piecePool.innerHTML = '';
        winModal.style.display = 'none';
        boardContainer.style.width = '0px';
        boardContainer.style.height = '0px';
    }

    function setupBoard(imgWidth, imgHeight) {
        const boardWrapper = document.querySelector('.board-wrapper');
        const wrapperWidth = boardWrapper.clientWidth;
        
        const aspectRatio = imgHeight / imgWidth;
        const boardWidth = wrapperWidth;
        const boardHeight = wrapperWidth * aspectRatio;

        boardContainer.style.width = `${boardWidth}px`;
        boardContainer.style.height = `${boardHeight}px`;
        boardContainer.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
        boardContainer.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;
        
        for (let i = 0; i < difficulty * difficulty; i++) {
            const slot = document.createElement('div');
            slot.classList.add('board-slot');
            const row = Math.floor(i / difficulty);
            const col = i % difficulty;
            slot.dataset.id = `piece_${row}_${col}`;
            addDropListeners(slot);
            boardContainer.appendChild(slot);
        }
    }

    function createPuzzlePieces(image) {
        const boardWidth = parseFloat(boardContainer.style.width);
        const boardHeight = parseFloat(boardContainer.style.height);
        const pieceWidth = boardWidth / difficulty;
        const pieceHeight = boardHeight / difficulty;
        let pieces = [];

        for (let i = 0; i < difficulty; i++) {
            for (let j = 0; j < difficulty; j++) {
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                piece.id = `piece_${i}_${j}`;
                piece.draggable = true;
                
                piece.style.width = `${pieceWidth}px`;
                piece.style.height = `${pieceHeight}px`;
                
                piece.style.backgroundImage = `url(${image.src})`;
                piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;
                piece.style.backgroundPosition = `-${j * pieceWidth}px -${i * pieceHeight}px`;
                
                piece.addEventListener('dragstart', onDragStart);
                pieces.push(piece);
            }
        }
        
        pieces.sort(() => Math.random() - 0.5); // Shuffle
        pieces.forEach(p => piecePool.appendChild(p));
        addDropListeners(piecePool);
    }

    // --- Drag and Drop ---
    function addDropListeners(element) {
        element.addEventListener('dragover', onDragOver);
        element.addEventListener('dragleave', onDragLeave);
        element.addEventListener('drop', onDrop);
    }

    function onDragStart(event) {
        draggedPiece = event.target;
        sourceContainer = draggedPiece.parentElement;
    }

    function onDragOver(event) {
        event.preventDefault();
        if(event.target.classList.contains('board-slot') || event.target.id === 'piece-pool') {
            event.target.classList.add('drag-over-highlight');
        }
    }
    
    function onDragLeave(event) {
        if(event.target.classList.contains('board-slot') || event.target.id === 'piece-pool') {
            event.target.classList.remove('drag-over-highlight');
        }
    }

    function onDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over-highlight');

        let dropTarget = event.target;
        if (dropTarget.classList.contains('puzzle-piece')) {
            dropTarget = dropTarget.parentElement;
        }

        if (dropTarget === sourceContainer) return;

        const pieceInTarget = dropTarget.querySelector('.puzzle-piece');
        
        if (pieceInTarget) {
            sourceContainer.appendChild(pieceInTarget);
        }
        dropTarget.appendChild(draggedPiece);

        moves++;
        moveCounter.textContent = moves;
        checkWinCondition();
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
        const slots = boardContainer.querySelectorAll('.board-slot');
        const isWin = Array.from(slots).every(slot => {
            const piece = slot.firstChild;
            return piece && piece.id === slot.dataset.id;
        });
        
        if (isWin) {
            clearInterval(timerInterval);
            winTime.textContent = timerDisplay.textContent;
            winMoves.textContent = moves;
            winModal.style.display = 'flex';
        }
    }
    
    // REMOVED startGame(); from here so it doesn't run on page load.
});
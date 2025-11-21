document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gridContainer = document.getElementById('grid-container');
    const nextNumberElement = document.getElementById('next-number');
    const levelSelectorDesktop = document.getElementById('level-selector-desktop');
    const levelSelectorMobile = document.getElementById('level-selector-mobile');
    const resetBtn = document.getElementById('reset-btn');
    const toggleHighlightBtn = document.getElementById('toggle-highlight-btn');

    // --- Game State ---
    const state = {
        gridSize: 5,
        currentNumber: 1,
        startTime: null,
        timerInterval: null,
        highlightingEnabled: true,
        isGameActive: false
    };

    // --- GameManager Init ---
    const gameManager = new GameManager({
        gameId: 'schulte-table',
        title: 'Schulte Table',
        scoreType: 'time', // Lower is better
        showBestScore: true,
        onRestart: () => {
            resetGame();
        }
    });

    // --- Core Game Logic ---
    function createGrid() {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${state.gridSize}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${state.gridSize}, 1fr)`;

        const totalCells = state.gridSize * state.gridSize;
        const numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
        shuffleArray(numbers);

        numbers.forEach(number => {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.textContent = number;
            cell.dataset.number = number;

            // Random colors for difficulty
            const hue = Math.floor(Math.random() * 360);
            const saturation = 70 + Math.random() * 30; // 70-100%
            const lightness = 40 + Math.random() * 20; // 40-60%
            cell.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            cell.style.borderColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            cell.style.textShadow = `0 0 10px hsl(${hue}, ${saturation}%, ${lightness}%, 0.5)`;

            cell.addEventListener('click', () => handleCellClick(cell, number));
            gridContainer.appendChild(cell);
        });

        resetState();
    }

    function handleCellClick(cell, number) {
        if (!state.isGameActive) {
            if (number === 1) {
                startGame();
            } else {
                return; // Ignore clicks before start unless it's 1
            }
        }

        if (number === state.currentNumber) {
            // Correct click
            cell.classList.add('found');
            if (!state.highlightingEnabled) {
                cell.style.opacity = '0.3'; // Dim if highlighting is off
            }

            state.currentNumber++;
            nextNumberElement.textContent = state.currentNumber;

            // Check Win
            if (state.currentNumber > state.gridSize * state.gridSize) {
                endGame();
            }
        } else {
            // Incorrect click
            cell.classList.add('error');
            setTimeout(() => cell.classList.remove('error'), 400);
        }
    }

    function startGame() {
        state.isGameActive = true;
        state.startTime = Date.now();
        state.timerInterval = setInterval(updateTimer, 100);
        gameManager.updateScore(0); // Reset score display
    }

    function updateTimer() {
        const elapsed = (Date.now() - state.startTime) / 1000;
        gameManager.updateScore(elapsed.toFixed(1) + 's');
    }

    function endGame() {
        clearInterval(state.timerInterval);
        state.isGameActive = false;
        const finalTime = (Date.now() - state.startTime) / 1000;
        gameManager.updateScore(finalTime); // Save raw number for best score comparison
        gameManager.showGameOver();
    }

    function resetGame() {
        clearInterval(state.timerInterval);
        state.isGameActive = false;
        state.currentNumber = 1;
        nextNumberElement.textContent = '1';
        gameManager.hideGameOver();
        createGrid();
    }

    function resetState() {
        clearInterval(state.timerInterval);
        state.isGameActive = false;
        state.currentNumber = 1;
        nextNumberElement.textContent = '1';
        gameManager.updateScore(0);
    }

    // --- Event Listeners ---
    function setLevel(size) {
        state.gridSize = parseInt(size);

        // Update UI
        levelSelectorMobile.value = size;

        // Update Desktop UI
        const desktopBtns = levelSelectorDesktop.querySelectorAll('.level-btn');
        desktopBtns.forEach(btn => {
            if (btn.dataset.size == size) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        resetGame();
    }

    levelSelectorDesktop.addEventListener('click', (e) => {
        if (e.target.classList.contains('level-btn')) {
            e.preventDefault();
            setLevel(e.target.dataset.size);
        }
    });

    levelSelectorMobile.addEventListener('change', (e) => {
        setLevel(e.target.value);
    });

    resetBtn.addEventListener('click', resetGame);

    toggleHighlightBtn.addEventListener('click', () => {
        state.highlightingEnabled = !state.highlightingEnabled;
        toggleHighlightBtn.textContent = `Highlight: ${state.highlightingEnabled ? 'On' : 'Off'}`;

        // Update existing found cells
        const foundCells = document.querySelectorAll('.grid-cell.found');
        foundCells.forEach(cell => {
            cell.style.opacity = state.highlightingEnabled ? '1' : '0.3';
        });
    });

    // --- Utility ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Init ---
    createGrid();
});
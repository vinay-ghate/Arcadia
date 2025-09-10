document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gridContainer = document.getElementById('grid-container');
    const timerElement = document.getElementById('timer');
    const nextNumberElement = document.getElementById('next-number');
    const nextNumberHint = document.getElementById('next-number-hint');
    const levelSelectorDesktop = document.getElementById('level-selector-desktop');
    const levelSelectorMobile = document.getElementById('level-selector-mobile');
    const resetBtn = document.getElementById('reset-btn');
    const toggleHighlightBtn = document.getElementById('toggle-highlight-btn');
    const colors = ['#E53935', '#1E88E5', '#43A047', '#FDD835', '#8E24AA', '#3949AB'];


    // Game State
    let state = {
        gridSize: 5,
        numbers: [],
        currentNumber: 1,
        gameStarted: false,
        timerInterval: null,
        startTime: 0,
        highlightingEnabled: false,
    };

    // --- Core Game Logic ---

    const createGrid = () => {
        stopTimer();
        state.currentNumber = 1;
        state.gameStarted = false;
        
        gridContainer.innerHTML = '';
        timerElement.textContent = '0.00';
        updateNextNumbers(state.currentNumber);
        nextNumberHint.classList.remove('visible');

        gridContainer.classList.toggle('highlight-off', !state.highlightingEnabled);

        const totalCells = state.gridSize * state.gridSize;
        state.numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
        shuffleArray(state.numbers);

        gridContainer.style.gridTemplateColumns = `repeat(${state.gridSize}, 1fr)`;
        for (const number of state.numbers) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.textContent = number;
            cell.dataset.number = number;
            
            // --- New Line Added ---
            // Assign a random color to the number's text
            cell.style.color = colors[Math.floor(Math.random() * colors.length)];
            // ----------------------

            cell.addEventListener('click', handleCellClick);
            gridContainer.appendChild(cell);
        }
    };
    const handleCellClick = (event) => {
        const clickedNumber = parseInt(event.target.dataset.number);

        if (!state.gameStarted && clickedNumber === 1) {
            state.gameStarted = true;
            nextNumberHint.classList.add('visible');
            startTimer();
        }

        if (!state.gameStarted) return;

        if (clickedNumber === state.currentNumber) {
            event.target.classList.add('found');
            state.currentNumber++;
            updateNextNumbers(state.currentNumber);

            if (state.currentNumber > state.gridSize * state.gridSize) {
                stopTimer();
                nextNumberElement.textContent = '🎉';
                nextNumberHint.classList.remove('visible');
            }
        } else {
            event.target.classList.add('error');
            setTimeout(() => event.target.classList.remove('error'), 300);
        }
    };
    
    const updateNextNumbers = (number) => {
        nextNumberElement.textContent = number;
        nextNumberHint.textContent = number;
    };

    // --- Timer Functions ---
    const startTimer = () => {
        state.startTime = Date.now();
        state.timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - state.startTime;
            timerElement.textContent = (elapsedTime / 1000).toFixed(2);
        }, 10);
    };

    const stopTimer = () => clearInterval(state.timerInterval);

    // --- Event Handlers ---
    const setLevel = (size) => {
        state.gridSize = parseInt(size);
        // Sync both selectors
        levelSelectorMobile.value = size;
        document.querySelector('#level-selector-desktop .active').classList.remove('active');
        document.querySelector(`#level-selector-desktop [data-size='${size}']`).classList.add('active');
        createGrid();
    };

    levelSelectorDesktop.addEventListener('click', (e) => {
        if (e.target.matches('.level-btn')) {
            e.preventDefault();
            setLevel(e.target.dataset.size);
        }
    });
    
    levelSelectorMobile.addEventListener('change', (e) => setLevel(e.target.value));

    resetBtn.addEventListener('click', createGrid);

    toggleHighlightBtn.addEventListener('click', () => {
        state.highlightingEnabled = !state.highlightingEnabled;
        gridContainer.classList.toggle('highlight-off', !state.highlightingEnabled);
        toggleHighlightBtn.textContent = `Highlight: ${state.highlightingEnabled ? 'On' : 'Off'}`;
    });

    // --- Utility Functions ---
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    
    // --- Initial Load ---
    createGrid();
});
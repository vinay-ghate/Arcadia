document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const replayBtn = document.getElementById('replay-btn');
    const tileContainer = document.getElementById('tile-container');

    // --- Game State ---
    const size = 4;
    let board = [];
    let score = 0;
    let bestScore = localStorage.getItem('2048-bestScore') || 0;
    let tileIdCounter = 0;
    
    // --- Game Initialization ---
    function init() {
        board = Array(size).fill(null).map(() => Array(size).fill(0));
        score = 0;
        tileIdCounter = 0;
        tileContainer.innerHTML = '';
        gameOverOverlay.classList.add('hidden');
        gameOverOverlay.classList.remove('flex');
        
        addRandomTile();
        addRandomTile();
        updateScores();
    }

    function updateScores() {
        scoreDisplay.textContent = score;
        bestScoreDisplay.textContent = bestScore;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('2048-bestScore', bestScore);
        }
    }
    
    // --- Game Logic: Creating and Rendering Tiles ---
    function createTile(tileData) {
        const tile = document.createElement('div');
        tile.id = `tile-${tileData.id}`;
        tile.className = 'tile tile-new';
        tile.style.setProperty('--c', tileData.c);
        tile.style.setProperty('--r', tileData.r);
        tile.dataset.value = tileData.value;
        tile.textContent = tileData.value;
        tileContainer.appendChild(tile);
    }

    function updateDOM(tilesToRemove, isBoardChanged) {
        if (!isBoardChanged) return;

        tilesToRemove.forEach(id => document.getElementById(`tile-${id}`)?.remove());

        board.flat().filter(Boolean).forEach(tile => {
            const tileElement = document.getElementById(`tile-${tile.id}`);
            const isMerged = tileElement && tile.value !== parseInt(tileElement.dataset.value);

            tileElement.style.setProperty('--c', tile.c);
            tileElement.style.setProperty('--r', tile.r);

            if (isMerged) {
                tileElement.dataset.value = tile.value;
                tileElement.textContent = tile.value;
                tileElement.classList.add('tile-merged');
                tileElement.addEventListener('animationend', () => tileElement.classList.remove('tile-merged'), { once: true });
            }
        });

        setTimeout(() => {
            addRandomTile();
            updateScores();
            if (!canMove()) checkGameOver();
        }, 150);
    }
    
    function addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!board[r][c]) emptyCells.push({ r, c });

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const newTile = { id: ++tileIdCounter, value: Math.random() < 0.9 ? 2 : 4, r, c };
            board[r][c] = newTile;
            createTile(newTile);
        }
    }

    // --- Game Logic: Movement ---
    function processLine(line, isForward) {
        if (isForward) line.reverse();
        let filtered = line.filter(Boolean);
        let result = [];
        let mergedIds = [];
        let lineScore = 0;

        for (let i = 0; i < filtered.length; i++) {
            if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
                const mergedTile = { ...filtered[i], value: filtered[i].value * 2 };
                result.push(mergedTile);
                mergedIds.push(filtered[i + 1].id);
                lineScore += mergedTile.value;
                i++;
            } else {
                result.push(filtered[i]);
            }
        }
        while (result.length < size) result.push(0);
        if (isForward) result.reverse();
        return { newLine: result, mergedIds, lineScore };
    }

    function move(direction) {
        let boardChanged = false;
        let tilesToRemove = [];
        let totalScoreIncrease = 0;
        const isVertical = direction === 'up' || direction === 'down';
        const isForward = direction === 'right' || direction === 'down';

        for (let i = 0; i < size; i++) {
            const line = Array.from({ length: size }, (_, j) => isVertical ? board[j][i] : board[i][j]);
            const { newLine, mergedIds, lineScore } = processLine([...line], isForward);
            totalScoreIncrease += lineScore;
            tilesToRemove.push(...mergedIds);

            for (let j = 0; j < size; j++) {
                const oldTile = isVertical ? board[j][i] : board[i][j];
                const newTile = newLine[j];
                if (oldTile !== newTile) boardChanged = true;
                if (newTile) {
                    newTile.r = isVertical ? j : i;
                    newTile.c = isVertical ? i : j;
                }
                if (isVertical) board[j][i] = newTile;
                else board[i][j] = newTile;
            }
        }
        if (boardChanged) score += totalScoreIncrease;
        updateDOM(tilesToRemove, boardChanged);
    }

    function canMove() {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!board[r][c]) return true;
                if (c < size - 1 && board[r][c].value === board[r][c + 1]?.value) return true;
                if (r < size - 1 && board[r][c].value === board[r + 1][c]?.value) return true;
            }
        }
        return false;
    }

    function checkGameOver() {
        gameOverOverlay.classList.remove('hidden');
        gameOverOverlay.classList.add('flex');
    }

    // --- Input Handling ---
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
        }
    });

    let touchStartX = 0, touchStartY = 0;
    tileContainer.addEventListener('touchstart', e => {
        if (e.touches.length > 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    tileContainer.addEventListener('touchend', e => {
        if (e.changedTouches.length > 1) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) move(deltaX > 0 ? 'right' : 'left');
            else move(deltaY > 0 ? 'down' : 'up');
        }
    });
    
    replayBtn.addEventListener('click', init);
    
    init();
});
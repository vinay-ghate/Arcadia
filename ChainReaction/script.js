document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');
    const gameOverScreen = document.getElementById('game-over-screen');
    const boardElement = document.getElementById('game-board');
    const scoresContainer = document.getElementById('scores');
    
    const playerCountSelect = document.getElementById('player-count');
    const startGameBtn = document.getElementById('start-game-btn');
    const backBtn = document.getElementById('back-btn');
    const replayBtn = document.getElementById('replay-btn');
    const winnerMessage = document.getElementById('winner-message');

    // --- Game State & Performance ---
    let gridSize;
    let players = [];
    let currentPlayerIndex = 0;
    let board = [];
    let isAnimating = false;
    let isGameOver = false;
    
    const ORB_POOL_SIZE = 200;
    const orbPool = [];
    const ANIMATION_DELAY_STEP = 150; // ms delay between chain reaction levels

    const PLAYER_COLORS = {
        1: 'var(--p1-color)', 2: 'var(--p2-color)',
        3: 'var(--p3-color)', 4: 'var(--p4-color)',
        5: 'var(--p5-color)', 6: 'var(--p6-color)',
    };
    
    const isMobile = () => window.innerWidth <= 768;

    function requestAppFullScreen() {
        const element = document.documentElement;
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
    }
    
    startGameBtn.addEventListener('click', startGame);
    backBtn.addEventListener('click', resetToMenu);
    replayBtn.addEventListener('click', resetToMenu);

    // --- Game Initialization ---
    function initializeOrbPool() {
        orbPool.forEach(orb => orb.element.remove());
        orbPool.length = 0;
        for (let i = 0; i < ORB_POOL_SIZE; i++) {
            const orbElement = document.createElement('div');
            orbElement.classList.add('orb', 'orb-moving', 'hidden');
            boardElement.appendChild(orbElement);
            orbPool.push({ element: orbElement, inUse: false });
        }
    }

    function startGame() {
        if (isMobile()) requestAppFullScreen();
        const playerCount = parseInt(playerCountSelect.value);
        isGameOver = false;
        isAnimating = false;
        gridSize = isMobile() ? 8 : 10;
        
        players = Array.from({ length: playerCount }, (_, i) => ({
            id: i + 1,
            color: PLAYER_COLORS[i + 1],
            score: 0
        }));
        currentPlayerIndex = 0;

        board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null).map(() => ({})));
        
        setupScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        createBoard();
        initializeOrbPool();
        updateScores();
    }

    function createBoard() {
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        boardElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                let capacity = 4;
                if ((r === 0 || r === gridSize - 1) && (c === 0 || c === gridSize - 1)) capacity = 2;
                else if (r === 0 || r === gridSize - 1 || c === 0 || c === gridSize - 1) capacity = 3;
                
                board[r][c] = { owner: null, orbs: 0, capacity, element: cell };
                cell.addEventListener('click', () => handleCellClick(r, c));
                cell.addEventListener('mouseenter', () => cell.classList.add('highlight'));
                cell.addEventListener('mouseleave', () => cell.classList.remove('highlight'));
                boardElement.appendChild(cell);
            }
        }
    }

    // --- New Game Logic Architecture ---
    function handleCellClick(r, c) {
        if (isAnimating || isGameOver) return;
        const cell = board[r][c];
        const currentPlayer = players[currentPlayerIndex];
        if (cell.owner !== null && cell.owner !== currentPlayer.id) return;

        isAnimating = true;

        // --- 1. LOGIC PHASE: Calculate reaction and update data model ---
        const animationQueue = [];
        cell.owner = currentPlayer.id;
        cell.orbs++;

        // Visually update just the clicked cell before the big animation
        renderCell(r, c);

        if (cell.orbs >= cell.capacity) {
            // This function ONLY updates the data model and populates the animation queue.
            // It does NOT render anything.
            runChainReactionLogic(r, c, currentPlayer.id, animationQueue);
        }

        // --- 2. ANIMATION PHASE ---
        playAnimationQueue(animationQueue).then(() => {
            // --- 3. POST-ANIMATION PHASE: Render the final board state & update UI ---
            renderBoard(); // NOW render the final state of all cells.
            updateScores();

            const totalOrbs = players.reduce((sum, p) => sum + p.score, 0);
            if (totalOrbs > players.length) {
                const activePlayers = players.filter(p => p.score > 0);
                if (activePlayers.length === 1) {
                    endGame(activePlayers[0]);
                    isAnimating = false;
                    return;
                }
            }
            
            let nextPlayerFound = false;
            let searchTurns = 0;
            while (!nextPlayerFound && searchTurns < players.length) {
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                if (players[currentPlayerIndex].score > 0 || totalOrbs < players.length) {
                    nextPlayerFound = true;
                }
                searchTurns++;
            }
            updateScores(); // Update again to highlight the new player
            isAnimating = false;
        });
    }

    function runChainReactionLogic(startR, startC, playerId, animationQueue) {
        // Visually empty the starting cell of the explosion immediately
        board[startR][startC].element.innerHTML = '';
        
        const logicQueue = [{ r: startR, c: startC, delay: 0 }];
        board[startR][startC].orbs = 0;

        let head = 0;
        while (head < logicQueue.length) {
            const { r, c, delay } = logicQueue[head++];
            const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            for (const [dr, dc] of neighbors) {
                const newR = r + dr;
                const newC = c + dc;

                if (newR >= 0 && newR < gridSize && newC >= 0 && newC < gridSize) {
                    animationQueue.push({ fromR: r, fromC: c, toR: newR, toC: newC, playerId, delay });
                    
                    const neighborCell = board[newR][newC];
                    neighborCell.owner = playerId;
                    neighborCell.orbs++;
                    
                    if (neighborCell.orbs >= neighborCell.capacity) {
                        logicQueue.push({ r: newR, c: newC, delay: delay + ANIMATION_DELAY_STEP });
                        neighborCell.orbs = 0;
                    }
                }
            }
        }
    }

    // --- Animation & Rendering ---
    function playAnimationQueue(queue) {
        if (queue.length === 0) return Promise.resolve();
        const promises = queue.map(anim => 
            new Promise(resolve => {
                setTimeout(() => {
                    animateOrbMove(anim.fromR, anim.fromC, anim.toR, anim.toC, anim.playerId).then(resolve);
                }, anim.delay);
            })
        );
        return Promise.all(promises);
    }

    function getOrbFromPool() {
        for (const poolObject of orbPool) if (!poolObject.inUse) {
            poolObject.inUse = true;
            return poolObject.element;
        }
        return null;
    }

    function returnOrbToPool(orbElement) {
        const poolObject = orbPool.find(p => p.element === orbElement);
        if (poolObject) {
            poolObject.inUse = false;
            poolObject.element.classList.add('hidden');
        }
    }

    function animateOrbMove(fromR, fromC, toR, toC, playerId) {
        return new Promise(resolve => {
            const orbElement = getOrbFromPool();
            if (!orbElement) { resolve(); return; }

            const fromCell = board[fromR][fromC].element;
            const toCell = board[toR][toC].element;
            orbElement.style.backgroundColor = PLAYER_COLORS[playerId];
            const orbSize = fromCell.clientWidth * 0.3;
            orbElement.style.width = `${orbSize}px`;
            orbElement.style.height = `${orbSize}px`;
            const startX = fromCell.offsetLeft + fromCell.clientWidth / 2;
            const startY = fromCell.offsetTop + fromCell.clientHeight / 2;
            const endX = toCell.offsetLeft + toCell.clientWidth / 2;
            const endY = toCell.offsetTop + toCell.clientHeight / 2;
            orbElement.style.left = `${startX}px`;
            orbElement.style.top = `${startY}px`;
            orbElement.classList.remove('hidden');

            requestAnimationFrame(() => {
                orbElement.style.left = `${endX}px`;
                orbElement.style.top = `${endY}px`;
            });

            const onAnimationEnd = () => {
                orbElement.removeEventListener('transitionend', onAnimationEnd);
                returnOrbToPool(orbElement);
                resolve();
            };
            orbElement.addEventListener('transitionend', onAnimationEnd);
        });
    }

    function renderBoard() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                renderCell(r, c);
            }
        }
    }

    function renderCell(r, c) {
        const { element, orbs, owner } = board[r][c];
        element.innerHTML = '';
        if (orbs > 0) {
            const orbSize = element.clientWidth * 0.3;
            for (let i = 0; i < orbs; i++) {
                const orb = document.createElement('div');
                orb.classList.add('orb');
                orb.style.backgroundColor = PLAYER_COLORS[owner];
                orb.style.width = `${orbSize}px`;
                orb.style.height = `${orbSize}px`;
                orb.dataset.orbCount = orbs;
                element.appendChild(orb);
            }
        }
    }
    
    function updateScores() {
        players.forEach(p => p.score = 0);
        board.flat().forEach(cell => {
            if (cell.owner && players[cell.owner - 1]) {
                players[cell.owner - 1].score += cell.orbs;
            }
        });

        scoresContainer.innerHTML = '';
        players.forEach((player, index) => {
            const scoreCard = document.createElement('div');
            scoreCard.className = 'score-card';
            if (index === currentPlayerIndex && !isGameOver) scoreCard.classList.add('active');
            scoreCard.style.borderColor = player.color;
            scoreCard.innerHTML = `<h3>Player ${player.id}</h3><p>${player.score}</p>`;
            scoresContainer.appendChild(scoreCard);
        });
    }

    // --- Game State Management ---
    function endGame(winner) {
        isGameOver = true;
        winnerMessage.textContent = `Player ${winner.id} Wins!`;
        winnerMessage.style.color = winner.color;
        
        gameContainer.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
    }

    function resetToMenu() {
        gameContainer.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
    }
});
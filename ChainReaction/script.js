document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');
    const boardElement = document.getElementById('game-board');
    const scoresContainer = document.getElementById('scores');

    const playerCountSelect = document.getElementById('player-count');
    const startGameBtn = document.getElementById('start-game-btn');

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

    // --- GameManager Init ---
    const gameManager = new GameManager({
        gameId: 'chain-reaction',
        title: 'Chain Reaction',
        scoreType: 'custom',
        showBestScore: false,
        gameOverLabel: 'Winner',
        formatScore: (winnerId) => {
            if (!winnerId) return '';
            return `Player ${winnerId} Wins!`;
        },
        onRestart: () => {
            resetToSetup();
        }
    });

    function requestAppFullScreen() {
        const element = document.documentElement;
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
    }

    startGameBtn.addEventListener('click', startGame);

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
        gameContainer.classList.remove('hidden');
        gameManager.hideGameOver();

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

    // --- Core Game Logic (Simulation & Animation) ---
    function handleCellClick(r, c) {
        if (isAnimating || isGameOver) return;
        const cell = board[r][c];
        const currentPlayer = players[currentPlayerIndex];

        // Validate move
        if (cell.owner !== null && cell.owner !== currentPlayer.id) return;

        isAnimating = true;

        // --- 1. LOGIC PHASE: Calculate reaction and update data model ---
        const animationQueue = [];

        // Create a deep copy for simulation
        const simBoard = board.map(row => row.map(cell => ({ ...cell })));

        // Initial move on simulation board
        const startCell = simBoard[r][c];
        startCell.owner = currentPlayer.id;
        startCell.orbs++;

        // Queue initial visual update
        animationQueue.push({
            type: 'UPDATE_CELL',
            r, c,
            orbs: startCell.orbs,
            owner: startCell.owner,
            delay: 0
        });

        if (startCell.orbs >= startCell.capacity) {
            runChainReactionLogic(simBoard, r, c, currentPlayer.id, animationQueue);
        }

        // Update the REAL board to match the final simulation state immediately
        // We update the properties of the existing board objects to preserve element references.
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                board[i][j].owner = simBoard[i][j].owner;
                board[i][j].orbs = simBoard[i][j].orbs;
            }
        }

        // --- 2. ANIMATION PHASE ---
        playAnimationQueue(animationQueue).then(() => {
            // --- 3. POST-ANIMATION PHASE ---
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

    function runChainReactionLogic(simBoard, startR, startC, playerId, animationQueue) {
        const logicQueue = [{ r: startR, c: startC, delay: 0 }];

        let head = 0;
        while (head < logicQueue.length) {
            const { r, c, delay } = logicQueue[head++];

            // Explode this cell in simulation
            simBoard[r][c].orbs = 0;
            simBoard[r][c].owner = null;

            // Queue visual clear
            animationQueue.push({
                type: 'UPDATE_CELL',
                r, c,
                orbs: 0,
                owner: null,
                delay: delay
            });

            const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            for (const [dr, dc] of neighbors) {
                const newR = r + dr;
                const newC = c + dc;

                if (newR >= 0 && newR < gridSize && newC >= 0 && newC < gridSize) {
                    // Move Orb Animation
                    animationQueue.push({
                        type: 'MOVE_ORB',
                        fromR: r, fromC: c,
                        toR: newR, toC: newC,
                        playerId,
                        delay: delay
                    });

                    // Update Neighbor in Simulation
                    const neighborCell = simBoard[newR][newC];
                    neighborCell.owner = playerId;
                    neighborCell.orbs++;

                    // Visual update for neighbor
                    const travelTime = 200;
                    animationQueue.push({
                        type: 'UPDATE_CELL',
                        r: newR, c: newC,
                        orbs: neighborCell.orbs,
                        owner: neighborCell.owner,
                        delay: delay + travelTime
                    });

                    if (neighborCell.orbs >= neighborCell.capacity) {
                        logicQueue.push({ r: newR, c: newC, delay: delay + ANIMATION_DELAY_STEP });
                        neighborCell.orbs = 0; // Prevent re-triggering in this loop pass
                    }
                }
            }
        }
    }

    function playAnimationQueue(queue) {
        if (queue.length === 0) return Promise.resolve();

        return new Promise(resolve => {
            const startTime = performance.now();
            // Sort animations by delay
            const pendingAnimations = queue.map(anim => ({
                ...anim,
                triggerTime: startTime + anim.delay,
                started: false
            })).sort((a, b) => a.triggerTime - b.triggerTime);

            let activeAnimationsCount = 0;
            let animationLoopId;

            function checkAnimations() {
                const now = performance.now();
                let allTriggered = true;

                for (let i = 0; i < pendingAnimations.length; i++) {
                    const anim = pendingAnimations[i];
                    if (!anim.started) {
                        if (now >= anim.triggerTime) {
                            anim.started = true;

                            if (anim.type === 'MOVE_ORB') {
                                activeAnimationsCount++;
                                animateOrbMove(anim.fromR, anim.fromC, anim.toR, anim.toC, anim.playerId, () => {
                                    activeAnimationsCount--;
                                });
                            } else if (anim.type === 'UPDATE_CELL') {
                                updateCellVisuals(anim.r, anim.c, anim.orbs, anim.owner);
                            }
                        } else {
                            allTriggered = false;
                            break;
                        }
                    }
                }

                if (allTriggered && activeAnimationsCount === 0) {
                    cancelAnimationFrame(animationLoopId);
                    resolve();
                } else {
                    animationLoopId = requestAnimationFrame(checkAnimations);
                }
            }

            animationLoopId = requestAnimationFrame(checkAnimations);
        });
    }

    function updateCellVisuals(r, c, orbs, owner) {
        const cell = board[r][c];
        cell.element.innerHTML = '';
        if (orbs > 0) {
            const orbSize = cell.element.clientWidth * 0.3;
            for (let i = 0; i < orbs; i++) {
                const orb = document.createElement('div');
                orb.classList.add('orb');
                orb.style.backgroundColor = PLAYER_COLORS[owner];
                orb.style.width = `${orbSize}px`;
                orb.style.height = `${orbSize}px`;
                orb.dataset.orbCount = orbs;
                cell.element.appendChild(orb);
            }
        }
    }

    function animateOrbMove(fromR, fromC, toR, toC, playerId, onComplete) {
        const orbElement = getOrbFromPool();
        if (!orbElement) { if (onComplete) onComplete(); return; }

        const fromCell = board[fromR][fromC].element;
        const toCell = board[toR][toC].element;

        if (!fromCell || !toCell) {
            returnOrbToPool(orbElement);
            if (onComplete) onComplete();
            return;
        }

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

        // Force reflow
        void orbElement.offsetWidth;

        requestAnimationFrame(() => {
            orbElement.style.left = `${endX}px`;
            orbElement.style.top = `${endY}px`;
        });

        let isComplete = false;
        const finish = () => {
            if (isComplete) return;
            isComplete = true;
            orbElement.removeEventListener('transitionend', finish);
            returnOrbToPool(orbElement);
            if (onComplete) onComplete();
        };

        orbElement.addEventListener('transitionend', finish);

        // Safety fallback: if transitionend doesn't fire within expected time + buffer
        setTimeout(finish, 300); // 200ms transition + 100ms buffer
    }

    function getOrbFromPool() {
        const poolItem = orbPool.find(item => !item.inUse);
        if (poolItem) {
            poolItem.inUse = true;
            return poolItem.element;
        }
        return null;
    }

    function returnOrbToPool(orbElement) {
        const poolItem = orbPool.find(item => item.element === orbElement);
        if (poolItem) {
            poolItem.inUse = false;
            orbElement.classList.add('hidden');
            orbElement.style.transition = 'none'; // Reset transition
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

    function endGame(winner) {
        isGameOver = true;
        gameManager.updateScore(winner.id);
        gameManager.showGameOver();
    }

    function resetToSetup() {
        gameContainer.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        gameManager.hideGameOver();
    }
});
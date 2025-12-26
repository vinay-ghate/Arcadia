class TicTacToeEngine {
    constructor() {
        this.gameState = {
            grid: Array(9).fill(null),
            activePlayer: 'X',
            humanMark: 'X',
            aiMark: 'O',
            matchFinished: false,
            gameStats: { human: 0, draws: 0, ai: 0 },
            aiLevel: 'medium'
        };

        this.victoryConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        this.elements = this.initializeElements();
        this.bindEventHandlers();
        this.setupInitialState();
    }

    initializeElements() {
        return {
            menuScreen: document.querySelector('#start-menu'),
            playScreen: document.querySelector('#game-screen'),
            xSelector: document.querySelector('#pick-x'),
            oSelector: document.querySelector('#pick-o'),
            launchBtn: document.querySelector('#new-game-btn'),
            gridCells: document.querySelectorAll('.board-cell'),
            activeIcon: document.querySelector('#turn-icon'),
            humanPoints: document.querySelector('#player-score'),
            drawPoints: document.querySelector('#tie-score'),
            aiPoints: document.querySelector('#cpu-score'),
            humanLabel: document.querySelector('#player-score-label'),
            aiLabel: document.querySelector('#cpu-score-label'),
            outcomeModal: document.querySelector('#result-modal'),
            resetModal: document.querySelector('#restart-modal'),
            outcomeText: document.querySelector('#modal-result-text'),
            winnerDisplay: document.querySelector('#modal-winner-announcement'),
            exitBtn: document.querySelector('#quit-btn'),
            continueBtn: document.querySelector('#next-round-btn'),
            resetBtn: document.querySelector('#restart-btn'),
            cancelBtn: document.querySelector('#cancel-restart-btn'),
            confirmBtn: document.querySelector('#confirm-restart-btn'),
            levelBtns: document.querySelectorAll('.difficulty-buttons .btn'),
            processingMsg: document.querySelector('#thinking-indicator')
        };
    }

    bindEventHandlers() {
        this.elements.xSelector.onclick = () => this.chooseSymbol('X');
        this.elements.oSelector.onclick = () => this.chooseSymbol('O');
        this.elements.levelBtns.forEach(btn =>
            btn.onclick = () => this.setDifficulty(btn.dataset.difficulty)
        );
        this.elements.launchBtn.onclick = () => this.initializeMatch();

        this.elements.gridCells.forEach(cell => {
            cell.onclick = (e) => this.processHumanMove(e);
            cell.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') this.processHumanMove(e);
            };
        });

        this.elements.resetBtn.onclick = () => this.displayModal(this.elements.resetModal);
        this.elements.cancelBtn.onclick = () => this.hideModal(this.elements.resetModal);
        this.elements.confirmBtn.onclick = () => {
            this.hideModal(this.elements.resetModal);
            this.clearGrid();
        };

        this.elements.exitBtn.onclick = () => {
            this.hideModal(this.elements.outcomeModal);
            this.returnToMenu();
        };

        this.elements.continueBtn.onclick = () => {
            this.hideModal(this.elements.outcomeModal);
            this.clearGrid();
        };
    }

    setupInitialState() {
        this.chooseSymbol('X');
    }

    chooseSymbol(mark) {
        this.gameState.humanMark = mark;
        this.gameState.aiMark = mark === 'X' ? 'O' : 'X';

        this.elements.xSelector.classList.toggle('active', mark === 'X');
        this.elements.oSelector.classList.toggle('active', mark === 'O');

        this.elements.gridCells.forEach(cell => {
            cell.className = 'board-cell';
            cell.classList.add(`${this.gameState.humanMark.toLowerCase()}-hover`);
        });
    }

    setDifficulty(level) {
        this.gameState.aiLevel = level;
        this.elements.levelBtns.forEach(btn =>
            btn.classList.toggle('active', btn.dataset.difficulty === level)
        );
    }

    initializeMatch() {
        this.elements.menuScreen.classList.add('hidden');
        this.elements.playScreen.classList.remove('hidden');

        this.elements.humanLabel.textContent = `${this.gameState.humanMark} (YOU)`;
        this.elements.aiLabel.textContent = `${this.gameState.aiMark} (CPU)`;

        this.clearGrid();
    }

    clearGrid() {
        this.gameState.grid.fill(null);
        this.gameState.matchFinished = false;
        this.gameState.activePlayer = 'X';

        this.elements.gridCells.forEach(cell => {
            cell.className = 'board-cell';
            cell.innerHTML = '<i></i>';
            cell.classList.add(`${this.gameState.humanMark.toLowerCase()}-hover`);
            cell.setAttribute('aria-label', 'Empty');
            cell.setAttribute('tabindex', '0');
        });

        this.refreshTurnDisplay();

        if (this.gameState.activePlayer === this.gameState.aiMark) {
            this.executeAiTurn();
        }
    }

    processHumanMove(event) {
        const position = parseInt(event.currentTarget.dataset.index);

        if (this.gameState.grid[position] ||
            this.gameState.matchFinished ||
            this.gameState.activePlayer !== this.gameState.humanMark) {
            return;
        }

        this.placeMark(position, this.gameState.humanMark);

        if (!this.gameState.matchFinished) {
            this.switchPlayer();
            this.executeAiTurn();
        }
    }

    placeMark(position, symbol) {
        if (this.gameState.grid[position] || this.gameState.matchFinished) return;

        this.gameState.grid[position] = symbol;
        const cell = this.elements.gridCells[position];

        cell.classList.add(symbol.toLowerCase(), 'show');
        cell.innerHTML = `<i class="bi bi-${symbol === 'X' ? 'x-lg' : 'circle'}"></i>`;
        cell.setAttribute('aria-label', `Cell marked as ${symbol}`);
        cell.setAttribute('tabindex', '-1');

        if (this.evaluateVictory(symbol)) {
            this.concludeMatch(false, symbol);
        } else if (this.gameState.grid.every(cell => cell !== null)) {
            this.concludeMatch(true);
        }
    }

    switchPlayer() {
        this.gameState.activePlayer = this.gameState.activePlayer === 'X' ? 'O' : 'X';
        this.refreshTurnDisplay();
    }

    concludeMatch(isDraw, victor = null) {
        this.gameState.matchFinished = true;

        if (!isDraw && victor) {
            const winningPattern = this.victoryConditions.find(pattern =>
                pattern.every(pos => this.gameState.grid[pos] === victor)
            );
            winningPattern.forEach(pos =>
                this.elements.gridCells[pos].classList.add('win-line')
            );
        }

        setTimeout(() => this.presentResult(isDraw, victor), 750);
    }

    refreshTurnDisplay() {
        this.elements.activeIcon.className =
            `bi bi-${this.gameState.activePlayer === 'X' ? 'x-lg' : 'circle'}`;
    }

    presentResult(isDraw, victor) {
        if (isDraw) {
            this.gameState.gameStats.draws++;
            this.elements.outcomeText.textContent = '';
            this.elements.winnerDisplay.innerHTML = '<h2 class="tie-color">ROUND TIED</h2>';
        } else {
            const humanWon = victor === this.gameState.humanMark;

            if (humanWon) {
                this.gameState.gameStats.human++;
            } else {
                this.gameState.gameStats.ai++;
            }

            this.elements.outcomeText.textContent = humanWon ? 'YOU WON!' : 'OH NO, YOU LOST...';
            this.elements.winnerDisplay.innerHTML = `
                <i class="icon-winner bi bi-${victor === 'X' ? 'x-lg' : 'circle'}"></i>
                <h2 class="${victor.toLowerCase()}-win-color">TAKES THE ROUND</h2>
            `;

            const iconColor = victor === 'X' ? 'var(--clr-light-blue)' : 'var(--clr-light-yellow)';
            this.elements.winnerDisplay.querySelector('.icon-winner').style.color = iconColor;
        }

        this.updateScoreDisplay();
        this.displayModal(this.elements.outcomeModal);
    }

    updateScoreDisplay() {
        this.elements.humanPoints.textContent = this.gameState.gameStats.human;
        this.elements.drawPoints.textContent = this.gameState.gameStats.draws;
        this.elements.aiPoints.textContent = this.gameState.gameStats.ai;
    }

    displayModal(modal) {
        modal.classList.add('show');
    }

    hideModal(modal) {
        modal.classList.remove('show');
    }

    returnToMenu() {
        this.elements.menuScreen.classList.remove('hidden');
        this.elements.playScreen.classList.add('hidden');
        this.gameState.gameStats = { human: 0, draws: 0, ai: 0 };
        this.updateScoreDisplay();
    }

    executeAiTurn() {
        if (this.gameState.matchFinished) return;

        this.elements.processingMsg.classList.add('visible');
        const delay = this.calculateThinkingTime(this.gameState.aiLevel);

        setTimeout(() => {
            this.elements.processingMsg.classList.remove('visible');
            const move = this.determineAiMove();

            if (move !== null) {
                this.placeMark(move, this.gameState.aiMark);
                if (!this.gameState.matchFinished) {
                    this.switchPlayer();
                }
            }
        }, delay);
    }

    calculateThinkingTime(level) {
        const delays = {
            easy: () => Math.random() * 600 + 400,
            hard: () => Math.random() * 1200 + 800,
            medium: () => Math.random() * 1000 + 600
        };
        return delays[level] ? delays[level]() : delays.medium();
    }

    determineAiMove() {
        const strategies = {
            easy: () => this.basicStrategy(),
            medium: () => this.intermediateStrategy(),
            hard: () => this.advancedStrategy()
        };
        return strategies[this.gameState.aiLevel]() || this.randomMove();
    }

    getAvailablePositions() {
        return this.gameState.grid
            .map((val, idx) => val === null ? idx : null)
            .filter(val => val !== null);
    }

    evaluateVictory(symbol) {
        return this.victoryConditions.some(pattern =>
            pattern.every(pos => this.gameState.grid[pos] === symbol)
        );
    }

    randomMove() {
        const available = this.getAvailablePositions();
        return available.length > 0 ?
            available[Math.floor(Math.random() * available.length)] : null;
    }

    findWinningPosition(symbol) {
        for (const pos of this.getAvailablePositions()) {
            this.gameState.grid[pos] = symbol;
            const canWin = this.evaluateVictory(symbol);
            this.gameState.grid[pos] = null;
            if (canWin) return pos;
        }
        return null;
    }

    findForkingPosition(symbol) {
        const available = this.getAvailablePositions();
        if (available.length < 5) return null;

        for (const pos of available) {
            this.gameState.grid[pos] = symbol;
            let winningMoves = 0;

            for (const nextPos of this.getAvailablePositions()) {
                this.gameState.grid[nextPos] = symbol;
                if (this.evaluateVictory(symbol)) winningMoves++;
                this.gameState.grid[nextPos] = null;
            }

            this.gameState.grid[pos] = null;
            if (winningMoves >= 2) return pos;
        }
        return null;
    }

    basicStrategy() {
        const blockMove = this.findWinningPosition(this.gameState.humanMark);
        if (blockMove !== null) return blockMove;

        if (Math.random() < 0.20) {
            const winMove = this.findWinningPosition(this.gameState.aiMark);
            if (winMove !== null) return winMove;
        }

        return this.randomMove();
    }

    intermediateStrategy() {
        if (Math.random() < 0.25) return this.randomMove();

        const winMove = this.findWinningPosition(this.gameState.aiMark);
        if (winMove !== null) return winMove;

        const blockMove = this.findWinningPosition(this.gameState.humanMark);
        if (blockMove !== null) return blockMove;

        if (this.gameState.grid[4] === null) return 4;

        return this.randomMove();
    }

    advancedStrategy() {
        const winMove = this.findWinningPosition(this.gameState.aiMark);
        if (winMove !== null) return winMove;

        const blockMove = this.findWinningPosition(this.gameState.humanMark);
        if (blockMove !== null) return blockMove;

        const forkMove = this.findForkingPosition(this.gameState.aiMark);
        if (forkMove !== null) return forkMove;

        const blockFork = this.findForkingPosition(this.gameState.humanMark);
        if (blockFork !== null) return blockFork;

        if (this.gameState.grid[4] === null) return 4;

        const cornerPositions = [0, 2, 6, 8];
        const humanCorners = cornerPositions.filter(pos =>
            this.gameState.grid[pos] === this.gameState.humanMark
        );

        if (humanCorners.length === 1) {
            const opposites = { 0: 8, 2: 6, 6: 2, 8: 0 };
            const opposite = opposites[humanCorners[0]];
            if (this.gameState.grid[opposite] === null) return opposite;
        }

        const emptyCorners = cornerPositions.filter(pos => this.gameState.grid[pos] === null);
        if (emptyCorners.length > 0) {
            return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        }

        return this.randomMove();
    }
}

// Initialize GameManager for home button
new GameManager({
    gameId: 'tictactoe-1p',
    title: 'Tic-Tac-Toe vs CPU'
});

const gameEngine = new TicTacToeEngine();
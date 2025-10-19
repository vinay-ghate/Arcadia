const GameState = {
    board: Array(9).fill(''),
    currentPlayer: 'x',
    gameActive: false,
    scores: { x: 0, o: 0, draws: 0 },
    playerSymbol: 'o',
    
    reset() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameActive = true;
    },
    
    makeMove(position, symbol) {
        if (this.board[position] === '' && this.gameActive) {
            this.board[position] = symbol;
            return true;
        }
        return false;
    },
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    },
    
    checkWinner() {
        const patterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (let pattern of patterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return { winner: this.board[a], pattern };
            }
        }
        
        if (!this.board.includes('')) {
            return { winner: 'draw', pattern: null };
        }
        
        return null;
    }
};

const UIController = {
    elements: {
        setupScreen: document.querySelector('.setup-screen'),
        gameContainer: document.querySelector('.game-container'),
        resultModal: document.querySelector('.result-modal'),
        startBtn: document.querySelector('.start-btn'),
        restartBtn: document.querySelector('.restart-btn'),
        nextBtn: document.querySelector('.next-btn'),
        quitBtn: document.querySelector('.quit-btn'),
        cells: document.querySelectorAll('.grid-cell'),
        cellStates: document.querySelectorAll('.cell-state'),
        statValues: document.querySelectorAll('.stat-value'),
        playerDisplay: document.querySelector('.player-display'),
        winnerDisplay: document.querySelector('.winner-display'),
        resultText: document.querySelector('.result-text')
    },
    
    init() {
        this.bindEvents();
        this.updatePlayerIndicator();
    },
    
    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.nextBtn.addEventListener('click', () => this.nextRound());
        this.elements.quitBtn.addEventListener('click', () => this.quitGame());
        
        this.elements.cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                const position = parseInt(e.currentTarget.dataset.pos);
                this.handleCellClick(position);
            });
        });
    },
    
    startGame() {
        const selectedSymbol = document.querySelector('input[name="player-symbol"]:checked').id;
        GameState.playerSymbol = selectedSymbol === 'pick-x' ? 'x' : 'o';
        
        this.addClickEffect(this.elements.startBtn);
        setTimeout(() => {
            this.elements.setupScreen.classList.add('hidden');
            this.elements.gameContainer.classList.remove('hidden');
            GameState.reset();
            this.updateBoard();
            this.updatePlayerIndicator();
        }, 300);
    },
    
    handleCellClick(position) {
        if (GameState.makeMove(position, GameState.currentPlayer)) {
            this.updateBoard();
            this.addClickEffect(this.elements.cells[position]);
            
            const result = GameState.checkWinner();
            if (result) {
                this.handleGameEnd(result);
            } else {
                GameState.switchPlayer();
                this.updatePlayerIndicator();
            }
        }
    },
    
    handleGameEnd(result) {
        GameState.gameActive = false;
        
        if (result.winner === 'draw') {
            GameState.scores.draws++;
            this.showResult('draw');
        } else {
            GameState.scores[result.winner]++;
            this.highlightWinningCells(result.pattern);
            this.showResult(result.winner);
        }
        
        this.updateScoreboard();
    },
    
    showResult(winner) {
        setTimeout(() => {
            this.elements.resultModal.classList.remove('hidden');
            
            if (winner === 'draw') {
                this.elements.resultText.textContent = "It's a Draw!";
                this.elements.winnerDisplay.querySelector('span').textContent = 'No Winner';
                this.elements.winnerDisplay.dataset.winner = '';
                this.elements.winnerDisplay.classList.add('draw-style');
            } else {
                this.elements.resultText.textContent = 'Round Complete!';
                this.elements.winnerDisplay.querySelector('span').textContent = 'Wins Round';
                this.elements.winnerDisplay.dataset.winner = `player-${winner}`;
                this.elements.winnerDisplay.classList.remove('draw-style');
            }
        }, 800);
    },
    
    highlightWinningCells(pattern) {
        pattern.forEach(index => {
            this.elements.cells[index].classList.add(`winning-${GameState.board[index]}`);
        });
    },
    
    updateBoard() {
        this.elements.cellStates.forEach((state, index) => {
            const symbol = GameState.board[index];
            state.dataset.mark = symbol ? `placed-${symbol}` : '';
            state.dataset.turn = `turn-${GameState.currentPlayer}`;
        });
    },
    
    updatePlayerIndicator() {
        document.querySelectorAll('[data-active-player]').forEach(el => {
            el.dataset.activePlayer = `player-${GameState.currentPlayer}`;
        });
    },
    
    updateScoreboard() {
        this.elements.statValues[0].textContent = GameState.scores.x;
        this.elements.statValues[1].textContent = GameState.scores.draws;
        this.elements.statValues[2].textContent = GameState.scores.o;
    },
    
    restartGame() {
        this.addClickEffect(this.elements.restartBtn);
        this.resetBoard();
        GameState.reset();
        this.updateBoard();
        this.updatePlayerIndicator();
    },
    
    nextRound() {
        this.addClickEffect(this.elements.nextBtn);
        setTimeout(() => {
            this.elements.resultModal.classList.add('hidden');
            this.resetBoard();
            GameState.reset();
            this.updateBoard();
            this.updatePlayerIndicator();
        }, 300);
    },
    
    quitGame() {
        this.addClickEffect(this.elements.quitBtn);
        GameState.scores = { x: 0, o: 0, draws: 0 };
        this.updateScoreboard();
        
        setTimeout(() => {
            this.elements.resultModal.classList.add('hidden');
            this.elements.gameContainer.classList.add('hidden');
            this.elements.setupScreen.classList.remove('hidden');
            this.resetBoard();
        }, 300);
    },
    
    resetBoard() {
        this.elements.cells.forEach(cell => {
            cell.className = 'grid-cell';
        });
    },
    
    addClickEffect(element) {
        element.classList.add('pressed');
        setTimeout(() => element.classList.remove('pressed'), 200);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});
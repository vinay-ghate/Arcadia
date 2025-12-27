// Number Guess Game Logic

// Game State
const STATES = {
    PLAYING: 'playing',
    WON: 'won',
    LOST: 'lost'
};

class NumberGuessGame {
    constructor() {
        this.maxGuesses = 6;  // Changed from 6 to 8
        this.numberLength = 5;
        this.currentRow = 0;
        this.currentTile = 0;
        this.state = STATES.PLAYING;
        this.targetNumber = this.getRandomNumber();
        this.guesses = [];
        this.keyboardState = {};

        this.initElements();
        this.initGameManager();
        this.createBoard();
        this.bindEvents();
        this.loadStats();

        console.log('Target number:', this.targetNumber); // For testing
    }

    initElements() {
        this.board = document.getElementById('game-board');
        this.keyboard = document.getElementById('keyboard');
        this.message = document.getElementById('message');
        this.statsModal = document.getElementById('stats-modal');
        this.statsButton = document.getElementById('stats-button');
        this.closeStatsButton = document.getElementById('close-stats');
        this.newGameButton = document.getElementById('new-game-button');
    }

    initGameManager() {
        this.gameManager = new GameManager({
            gameId: 'number-guess',
            title: 'Number Guess'
        });
    }

    getRandomNumber() {
        // Generate a random 5-digit number (10000-99999)
        return String(Math.floor(Math.random() * 90000) + 10000);
    }

    createBoard() {
        for (let i = 0; i < this.maxGuesses; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            row.id = `row-${i}`;

            for (let j = 0; j < this.numberLength; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
            }

            this.board.appendChild(row);
        }
    }

    bindEvents() {
        // Keyboard clicks
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                this.handleKey(key.dataset.key);
            });
        });

        // Physical keyboard
        document.addEventListener('keydown', (e) => {
            if (this.state !== STATES.PLAYING) return;

            if (e.key === 'Enter') {
                this.handleKey('ENTER');
            } else if (e.key === 'Backspace') {
                this.handleKey('BACKSPACE');
            } else if (/^[0-9]$/.test(e.key)) {
                this.handleKey(e.key);
            }
        });

        // Stats modal
        this.statsButton.addEventListener('click', () => this.showStats());
        this.closeStatsButton.addEventListener('click', () => this.hideStats());
        this.newGameButton.addEventListener('click', () => {
            this.hideStats();
            this.resetGame();
        });

        // Close modal on outside click
        this.statsModal.addEventListener('click', (e) => {
            if (e.target === this.statsModal) {
                this.hideStats();
            }
        });
    }

    handleKey(key) {
        if (this.state !== STATES.PLAYING) return;

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (this.currentTile < this.numberLength) {
            this.addLetter(key);
        }
    }

    addLetter(number) {
        if (this.currentTile < this.numberLength) {
            const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
            tile.textContent = number;
            tile.classList.add('filled');
            this.currentTile++;
        }
    }

    deleteLetter() {
        if (this.currentTile > 0) {
            this.currentTile--;
            const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    }

    submitGuess() {
        if (this.currentTile !== this.numberLength) {
            this.showMessage('Not enough digits', 'error');
            this.shakeRow();
            return;
        }

        const guess = this.getCurrentGuess();
        this.guesses.push(guess);
        this.flipTiles(guess);
    }

    getCurrentGuess() {
        let guess = '';
        for (let i = 0; i < this.numberLength; i++) {
            const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
            guess += tile.textContent;
        }
        return guess;
    }

    flipTiles(guess) {
        const result = this.checkGuess(guess);

        for (let i = 0; i < this.numberLength; i++) {
            setTimeout(() => {
                const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
                tile.classList.add('flip');
                tile.classList.add(result[i]);

                // Update keyboard
                const digit = guess[i];
                this.updateKeyboard(digit, result[i]);
            }, i * 300);
        }

        setTimeout(() => {
            if (guess === this.targetNumber) {
                this.winGame();
            } else if (this.currentRow === this.maxGuesses - 1) {
                this.loseGame();
            } else {
                this.currentRow++;
                this.currentTile = 0;
            }
        }, this.numberLength * 300 + 500);
    }

    checkGuess(guess) {
        const result = Array(this.numberLength).fill('absent');
        const targetDigits = this.targetNumber.split('');
        const guessDigits = guess.split('');

        // Check for correct positions first (green)
        for (let i = 0; i < this.numberLength; i++) {
            if (guessDigits[i] === targetDigits[i]) {
                result[i] = 'correct';
                targetDigits[i] = null;
                guessDigits[i] = null;
            }
        }

        // Check for present digits (yellow - wrong position)
        for (let i = 0; i < this.numberLength; i++) {
            if (guessDigits[i] && targetDigits.includes(guessDigits[i])) {
                result[i] = 'present';
                targetDigits[targetDigits.indexOf(guessDigits[i])] = null;
            }
        }

        return result;
    }

    updateKeyboard(digit, state) {
        const key = document.querySelector(`[data-key="${digit}"]`);
        if (!key) return;

        const currentState = this.keyboardState[digit];

        // Priority: correct > present > absent
        if (state === 'correct' ||
            (state === 'present' && currentState !== 'correct') ||
            (state === 'absent' && !currentState)) {
            this.keyboardState[digit] = state;
            key.classList.remove('correct', 'present', 'absent');
            key.classList.add(state);
        }
    }

    shakeRow() {
        const row = document.getElementById(`row-${this.currentRow}`);
        row.classList.add('shake');
        setTimeout(() => row.classList.remove('shake'), 500);
    }

    showMessage(text, type = 'info') {
        this.message.textContent = text;
        this.message.className = `h-8 mb-4 text-center font-semibold ${type === 'error' ? 'text-red-400' : 'text-neon-cyan'}`;
        setTimeout(() => {
            this.message.textContent = '';
        }, 2000);
    }

    winGame() {
        this.state = STATES.WON;
        this.showMessage('🎉 Congratulations!', 'success');
        this.updateStats(true, this.currentRow + 1);
        setTimeout(() => this.showStats(), 2000);
    }

    loseGame() {
        this.state = STATES.LOST;
        this.showMessage(`The number was ${this.targetNumber}`, 'error');
        this.updateStats(false, 0);
        setTimeout(() => this.showStats(), 2000);
    }

    resetGame() {
        this.currentRow = 0;
        this.currentTile = 0;
        this.state = STATES.PLAYING;
        this.targetNumber = this.getRandomNumber();
        this.guesses = [];
        this.keyboardState = {};

        // Clear board
        this.board.innerHTML = '';
        this.createBoard();

        // Reset keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });

        this.message.textContent = '';
        console.log('New target number:', this.targetNumber); // For testing
    }

    // Statistics
    loadStats() {
        const saved = localStorage.getItem('numberGuessStats');
        this.stats = saved ? JSON.parse(saved) : {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            guessDistribution: [0, 0, 0, 0, 0, 0, 0, 0] // 8 attempts
        };
    }

    updateStats(won, guessCount) {
        this.stats.gamesPlayed++;

        if (won) {
            this.stats.gamesWon++;
            this.stats.currentStreak++;
            this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
            this.stats.guessDistribution[guessCount - 1]++;
        } else {
            this.stats.currentStreak = 0;
        }

        localStorage.setItem('numberGuessStats', JSON.stringify(this.stats));
    }

    showStats() {
        const winRate = this.stats.gamesPlayed > 0
            ? Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100)
            : 0;

        document.getElementById('stat-played').textContent = this.stats.gamesPlayed;
        document.getElementById('stat-win-rate').textContent = winRate;
        document.getElementById('stat-current-streak').textContent = this.stats.currentStreak;
        document.getElementById('stat-max-streak').textContent = this.stats.maxStreak;

        // Guess distribution
        const distributionDiv = document.getElementById('guess-distribution');
        distributionDiv.innerHTML = '';

        const maxGuesses = Math.max(...this.stats.guessDistribution, 1);

        this.stats.guessDistribution.forEach((count, index) => {
            const barDiv = document.createElement('div');
            barDiv.className = 'distribution-bar';

            const width = (count / maxGuesses) * 100;

            barDiv.innerHTML = `
                <div class="bar-number">${index + 1}</div>
                <div class="bar-container" style="width: ${Math.max(width, 7)}%">
                    <div class="bar-value">${count}</div>
                </div>
            `;

            distributionDiv.appendChild(barDiv);
        });

        this.statsModal.classList.remove('hidden');
        this.statsModal.classList.add('flex');
    }

    hideStats() {
        this.statsModal.classList.remove('flex');
        this.statsModal.classList.add('hidden');
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new NumberGuessGame();
        console.log('Number Guess game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize Number Guess:', error);
        alert('Failed to start game. Please refresh the page.');
    }
});

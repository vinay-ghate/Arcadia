/**
 * GameManager - Unified game management system for Arcadia games
 * Handles back button, score display, and game over overlay
 */
class GameManager {
    constructor(config = {}) {
        this.gameId = config.gameId || 'game';
        this.title = config.title || 'Game';
        this.onRestart = config.onRestart || (() => window.location.reload());
        this.score = 0;

        this.init();
    }

    init() {
        this.createBackButton();
        this.createScoreDisplay();
        this.createGameOverOverlay();
    }

    createBackButton() {
        // Create back button with icon
        const backButton = document.createElement('button');
        backButton.id = 'back-button';
        backButton.className = 'back-button';
        backButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        `;
        backButton.onclick = () => window.location.href = '../../index.html';

        // Insert at the beginning of body
        document.body.insertBefore(backButton, document.body.firstChild);
    }

    createScoreDisplay() {
        // Create score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.className = 'score-display';
        scoreDisplay.innerHTML = `<span>Score:</span> <span id="score-value">0</span>`;

        // Insert after back button
        const backButton = document.getElementById('back-button');
        if (backButton && backButton.nextSibling) {
            document.body.insertBefore(scoreDisplay, backButton.nextSibling);
        } else {
            document.body.insertBefore(scoreDisplay, document.body.firstChild);
        }
    }

    createGameOverOverlay() {
        // Create game over overlay
        const overlay = document.createElement('div');
        overlay.id = 'game-over-overlay';
        overlay.className = 'game-over-overlay hidden';
        overlay.innerHTML = `
            <div class="game-over-content">
                <h2>Game Over!</h2>
                <p class="final-score">Score: <span id="final-score">0</span></p>
                <div class="game-over-buttons">
                    <button id="restart-button" class="game-button">Play Again</button>
                    <button id="home-button" class="game-button">Home</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Add event listeners
        document.getElementById('restart-button').onclick = () => {
            this.hideGameOver();
            this.onRestart();
        };

        document.getElementById('home-button').onclick = () => {
            window.location.href = '../../index.html';
        };
    }

    addScore(points) {
        this.score += points;
        this.updateScoreDisplay();
    }

    setScore(score) {
        this.score = score;
        this.updateScoreDisplay();
    }

    resetScore() {
        this.score = 0;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        const scoreValue = document.getElementById('score-value');
        if (scoreValue) {
            scoreValue.textContent = this.score;
        }
    }

    showGameOver() {
        const overlay = document.getElementById('game-over-overlay');
        const finalScore = document.getElementById('final-score');

        if (overlay && finalScore) {
            finalScore.textContent = this.score;
            overlay.classList.remove('hidden');
        }
    }

    hideGameOver() {
        const overlay = document.getElementById('game-over-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}

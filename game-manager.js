class GameManager {
    constructor(config) {
        this.gameId = config.gameId;
        this.title = config.title;
        this.onRestart = config.onRestart;
        this.onHome = config.onHome || (() => window.location.href = '../');
        this.scoreType = config.scoreType || 'points'; // 'points' or 'time'
        this.formatScore = config.formatScore || (score => score);
        this.showBestScore = config.showBestScore !== false; // Default true
        this.gameOverLabel = config.gameOverLabel || (this.scoreType === 'time' ? 'Final Time' : 'Final Score');

        this.score = 0;
        this.bestScore = this.loadBestScore();

        this.initUI();
    }

    initUI() {
        // Create UI container if it doesn't exist
        if (!document.getElementById('game-ui-layer')) {
            const uiLayer = document.createElement('div');
            uiLayer.id = 'game-ui-layer';
            document.body.appendChild(uiLayer);
        }

        this.uiLayer = document.getElementById('game-ui-layer');

        // Inject Back Button
        if (!document.querySelector('.back-button')) {
            const backBtn = document.createElement('button');
            backBtn.className = 'back-button';
            backBtn.innerHTML = 'Menu';
            backBtn.onclick = this.onHome;
            this.uiLayer.appendChild(backBtn);
        }

        // Inject Score Display
        if (!document.querySelector('.score-display')) {
            const scoreContainer = document.createElement('div');
            scoreContainer.className = 'score-display';

            let scoreHtml = `
                <div class="score-group">
                    <div class="label">${this.scoreType === 'time' ? 'TIME' : 'SCORE'}</div>
                    <div class="value" id="current-score">${this.formatScore(this.score)}</div>
                </div>
            `;

            if (this.showBestScore) {
                scoreHtml += `
                <div class="score-group" style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                    <div class="label">BEST</div>
                    <div class="value" id="best-score">${this.bestScore === null ? '-' : this.formatScore(this.bestScore)}</div>
                </div>
                `;
            }

            scoreContainer.innerHTML = scoreHtml;
            this.uiLayer.appendChild(scoreContainer);
        }

        // Inject Game Over Modal
        let gameOverModal = document.querySelector('.game-over-overlay');
        if (!gameOverModal) {
            gameOverModal = document.createElement('div');
            gameOverModal.className = 'game-over-overlay';
            gameOverModal.id = 'game-over-modal';
            gameOverModal.innerHTML = `
                <h2>Game Over!</h2>
                <p>${this.gameOverLabel}</p>
                <div class="final-score" id="final-score">${this.formatScore(this.score)}</div>
                <button class="game-button" id="restart-btn">Play Again</button>
            `;
            this.uiLayer.appendChild(gameOverModal);
        }

        // Attach event listener to restart button
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn && !restartBtn.hasAttribute('data-listener-attached')) {
            restartBtn.setAttribute('data-listener-attached', 'true');
            restartBtn.addEventListener('click', () => {
                this.hideGameOver();
                if (this.onRestart) {
                    this.onRestart();
                }
            });
        }
    }

    updateScore(newScore) {
        this.score = newScore;
        const currentScoreEl = document.getElementById('current-score');
        if (currentScoreEl) currentScoreEl.textContent = this.formatScore(this.score);

        let isNewBest = false;
        if (this.scoreType === 'time') {
            // For time, lower is better. 
            // If bestScore is null (0/unset), any score is better (except 0 if we treat 0 as unset)
            // But usually 0 is initial. Let's assume 0 means no best score yet for time? 
            // Or we store null/Infinity. LocalStorage stores strings.
            // Let's say if bestScore is 0, it's unset.
            if (this.bestScore === 0 || this.score < this.bestScore) {
                isNewBest = true;
            }
        } else {
            // For points, higher is better
            if (this.score > this.bestScore) {
                isNewBest = true;
            }
        }

        if (isNewBest && this.showBestScore) {
            this.bestScore = this.score;
            const bestScoreEl = document.getElementById('best-score');
            if (bestScoreEl) bestScoreEl.textContent = this.formatScore(this.bestScore);
            this.saveBestScore();
        }
    }

    addScore(points) {
        this.updateScore(this.score + points);
    }

    resetScore() {
        this.updateScore(0);
    }

    showGameOver() {
        const finalScoreEl = document.getElementById('final-score');
        if (finalScoreEl) finalScoreEl.textContent = this.formatScore(this.score);
        document.getElementById('game-over-modal').classList.add('show');
    }

    hideGameOver() {
        document.getElementById('game-over-modal').classList.remove('show');
    }

    loadBestScore() {
        const saved = localStorage.getItem(`arcadia_best_${this.gameId}`);
        return saved ? parseFloat(saved) : 0;
    }

    saveBestScore() {
        localStorage.setItem(`arcadia_best_${this.gameId}`, this.bestScore);
    }
}

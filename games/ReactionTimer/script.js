// Reaction Timer Game Logic

// Game States
const STATES = {
    READY: 'ready',
    WAITING: 'waiting',
    GO: 'go',
    RESULT: 'result',
    TOO_EARLY: 'too-early'
};

// Game Class
class ReactionTimer {
    constructor() {
        this.state = STATES.READY;
        this.startTime = 0;
        this.reactionTime = 0;
        this.waitTimeout = null;
        this.bestTime = this.loadBestTime();

        this.initElements();
        this.initGameManager();
        this.bindEvents();
        this.updateBestTimeDisplay();
    }

    initElements() {
        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.waitingScreen = document.getElementById('waiting-screen');
        this.goScreen = document.getElementById('go-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.tooEarlyScreen = document.getElementById('too-early-screen');

        // Buttons
        this.startButton = document.getElementById('start-button');
        this.retryButton = document.getElementById('retry-button');
        this.restartButton = document.getElementById('restart-button');

        // Display elements
        this.reactionTimeDisplay = document.getElementById('reaction-time');
        this.resultMessage = document.getElementById('result-message');
        this.bestTimeValue = document.getElementById('best-time-value');
        this.resultBestValue = document.getElementById('result-best-value');
    }

    initGameManager() {
        // Initialize GameManager for home button
        this.gameManager = new GameManager({
            gameId: 'reaction-timer',
            title: 'Reaction Timer'
        });
    }

    bindEvents() {
        // Button clicks
        this.startButton.addEventListener('click', () => this.startTest());
        this.retryButton.addEventListener('click', () => this.reset());
        this.restartButton.addEventListener('click', () => this.reset());

        // Screen clicks
        this.waitingScreen.addEventListener('click', () => this.handleWaitingClick());
        this.goScreen.addEventListener('click', () => this.handleGoClick());

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.handleKeyPress();
            }
        });
    }

    handleKeyPress() {
        switch (this.state) {
            case STATES.READY:
                this.startTest();
                break;
            case STATES.WAITING:
                this.handleWaitingClick();
                break;
            case STATES.GO:
                this.handleGoClick();
                break;
            case STATES.RESULT:
            case STATES.TOO_EARLY:
                this.reset();
                break;
        }
    }

    startTest() {
        this.setState(STATES.WAITING);

        // Random delay between 1-5 seconds
        const delay = Math.random() * 4000 + 1000;

        this.waitTimeout = setTimeout(() => {
            this.showGo();
        }, delay);
    }

    showGo() {
        this.setState(STATES.GO);
        this.startTime = performance.now();
    }

    handleWaitingClick() {
        // Clicked too early!
        clearTimeout(this.waitTimeout);
        this.setState(STATES.TOO_EARLY);
    }

    handleGoClick() {
        if (this.state !== STATES.GO) return;

        // Calculate reaction time
        const endTime = performance.now();
        this.reactionTime = Math.round(endTime - this.startTime);

        // Update best time if applicable
        if (this.bestTime === null || this.reactionTime < this.bestTime) {
            this.bestTime = this.reactionTime;
            this.saveBestTime();
        }

        this.showResult();
    }

    showResult() {
        this.setState(STATES.RESULT);

        // Display reaction time
        this.reactionTimeDisplay.textContent = this.reactionTime;

        // Display message based on reaction time
        let message = '';
        let messageClass = '';

        if (this.reactionTime < 200) {
            message = '🚀 Lightning Fast!';
            messageClass = 'excellent';
        } else if (this.reactionTime < 300) {
            message = '⚡ Excellent!';
            messageClass = 'good';
        } else if (this.reactionTime < 400) {
            message = '👍 Good!';
            messageClass = 'average';
        } else if (this.reactionTime < 500) {
            message = '😊 Not Bad!';
            messageClass = 'average';
        } else {
            message = '🐌 Keep Practicing!';
            messageClass = 'slow';
        }

        this.resultMessage.textContent = message;
        this.resultMessage.className = `result-message ${messageClass}`;

        // Update best time display
        this.updateBestTimeDisplay();

        // Update GameManager score
        this.gameManager.setScore(this.reactionTime);
    }

    setState(newState) {
        this.state = newState;

        // Hide all screens
        this.startScreen.classList.remove('active');
        this.waitingScreen.classList.remove('active');
        this.goScreen.classList.remove('active');
        this.resultScreen.classList.remove('active');
        this.tooEarlyScreen.classList.remove('active');

        // Show current screen
        switch (newState) {
            case STATES.READY:
                this.startScreen.classList.add('active');
                break;
            case STATES.WAITING:
                this.waitingScreen.classList.add('active');
                break;
            case STATES.GO:
                this.goScreen.classList.add('active');
                break;
            case STATES.RESULT:
                this.resultScreen.classList.add('active');
                break;
            case STATES.TOO_EARLY:
                this.tooEarlyScreen.classList.add('active');
                break;
        }
    }

    reset() {
        clearTimeout(this.waitTimeout);
        this.setState(STATES.READY);
        this.reactionTime = 0;
        this.startTime = 0;
    }

    loadBestTime() {
        const saved = localStorage.getItem('reactionTimerBest');
        return saved ? parseInt(saved) : null;
    }

    saveBestTime() {
        localStorage.setItem('reactionTimerBest', this.bestTime.toString());
    }

    updateBestTimeDisplay() {
        const displayValue = this.bestTime !== null ? `${this.bestTime}ms` : '--';
        this.bestTimeValue.textContent = displayValue;
        this.resultBestValue.textContent = displayValue;
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new ReactionTimer();
        console.log('Reaction Timer game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize Reaction Timer:', error);
        alert('Failed to start game. Please refresh the page.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const message = document.getElementById('message');
    const attemptsDisplay = document.getElementById('attempts');
    const historyContainer = document.getElementById('guess-history');

    let targetNumber;
    let attempts = 0;
    let hasWon = false;

    const gameManager = new GameManager({
        gameId: 'guess-number',
        title: 'Guess The Number',
        onRestart: initGame
    });

    function initGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        hasWon = false;
        message.textContent = "Start guessing!";
        message.className = '';
        attemptsDisplay.textContent = "Attempts: 0";
        historyContainer.innerHTML = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessBtn.disabled = false;
        gameManager.resetScore(); // Score could be inverse of attempts, but let's keep it simple
    }

    function checkGuess() {
        if (hasWon) return;

        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            message.textContent = "Please enter 1-100";
            return;
        }

        attempts++;
        attemptsDisplay.textContent = `Attempts: ${attempts}`;

        // Add to history
        const chip = document.createElement('span');
        chip.className = 'history-chip';
        chip.textContent = guess;
        historyContainer.appendChild(chip);

        if (guess === targetNumber) {
            message.textContent = "Correct! You Win!";
            message.className = 'correct';
            hasWon = true;
            guessInput.disabled = true;
            guessBtn.disabled = true;

            // Calculate score based on attempts (fewer is better)
            // Max score 1000, minus 100 per attempt?
            const score = Math.max(0, 1000 - (attempts - 1) * 50);
            gameManager.addScore(score);
            gameManager.showGameOver();

        } else if (guess < targetNumber) {
            message.textContent = "Too Low!";
            message.className = 'low';
        } else {
            message.textContent = "Too High!";
            message.className = 'high';
        }

        guessInput.value = '';
        guessInput.focus();
    }

    guessBtn.addEventListener('click', checkGuess);

    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkGuess();
    });

    initGame();
});

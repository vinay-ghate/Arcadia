document.addEventListener('DOMContentLoaded', () => {
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

    const resultArea = document.getElementById('result-area');
    const playerEmoji = document.getElementById('player-emoji');
    const computerEmoji = document.getElementById('computer-emoji');
    const message = document.getElementById('message');

    const gameManager = new GameManager({
        gameId: 'rps',
        title: 'Rock Paper Scissors',
        onRestart: resetGame
    });

    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playRound(btn.dataset.choice);
        });
    });

    function playRound(playerChoice) {
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];

        // Update UI
        playerEmoji.textContent = emojis[playerChoice];
        computerEmoji.textContent = emojis[computerChoice];
        resultArea.classList.add('show');

        // Determine winner
        if (playerChoice === computerChoice) {
            message.textContent = "It's a Draw!";
            message.className = 'message draw';
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            message.textContent = "You Win!";
            message.className = 'message win';
            gameManager.addScore(1);
        } else {
            message.textContent = "You Lose!";
            message.className = 'message lose';
        }
    }

    function resetGame() {
        resultArea.classList.remove('show');
        message.textContent = "Make your move!";
        message.className = 'message';
        gameManager.resetScore();
    }
});

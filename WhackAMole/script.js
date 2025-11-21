document.addEventListener('DOMContentLoaded', () => {
    const holes = document.querySelectorAll('.hole');
    const startBtn = document.getElementById('start-btn');
    let lastHole;
    let timeUp = false;
    let score = 0;

    const gameManager = new GameManager({
        gameId: 'whack-a-mole',
        title: 'Whack-a-Mole',
        onRestart: startGame
    });

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole) {
            return randomHole(holes);
        }
        lastHole = hole;
        return hole;
    }

    function peep() {
        const time = randomTime(200, 1000);
        const hole = randomHole(holes);
        hole.classList.add('up');
        setTimeout(() => {
            hole.classList.remove('up');
            if (!timeUp) peep();
        }, time);
    }

    function startGame() {
        score = 0;
        gameManager.resetScore();
        timeUp = false;
        startBtn.disabled = true;
        peep();
        setTimeout(() => {
            timeUp = true;
            startBtn.disabled = false;
            gameManager.showGameOver();
        }, 15000); // 15 seconds game
    }

    function bonk(e) {
        if (!e.isTrusted) return; // cheater!
        if (!this.classList.contains('up')) return;

        score++;
        this.classList.remove('up');
        gameManager.addScore(1);
    }

    holes.forEach(hole => hole.addEventListener('click', bonk));
    startBtn.addEventListener('click', startGame);
});

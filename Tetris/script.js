document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const gameBoard = document.getElementById("game-board");
  // Score display handled by GameManager
  const nextPieceGrid = document.getElementById("next-piece-grid");
  const restartBtn = document.getElementById("restart-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const downBtn = document.getElementById("down-btn");
  const rotateBtn = document.getElementById("rotate-btn");

  // --- GameManager Init ---
  const gameManager = new GameManager({
    gameId: 'tetris',
    title: 'Tetris',
    onRestart: resetGame
  });

  // --- Game Constants ---
  const COLS = 10;
  const ROWS = 20;

  // --- Tetrominoes (matches your CSS class names) ---
  const PIECES = [
    { shape: [[1, 1, 1, 1]], className: "block-i" }, // Cyan in your CSS
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      className: "block-o",
    },
    {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      className: "block-t",
    }, // Purple in your CSS
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      className: "block-s",
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      className: "block-z",
    }, // Red in your CSS
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      className: "block-j",
    },
    {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
      ],
      className: "block-l",
    },
  ];

  // --- Game State ---
  let board, currentPiece, nextPiece, score, isGameOver, isPaused;
  let dropInterval = 1000;
  let dropCounter = 0;
  let lastTime = 0;

  // --- Core Functions ---
  function getRandomPiece() {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: piece.shape,
      className: piece.className,
      x: 0,
      y: 0,
    };
  }

  function spawnNewPiece() {
    currentPiece = nextPiece;
    nextPiece = getRandomPiece();
    currentPiece.x =
      Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
    currentPiece.y = 0;

    if (!isValidMove(currentPiece)) {
      isGameOver = true;
      gameManager.showGameOver();
    }
  }

  function isValidMove(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          if (
            newX < 0 ||
            newX >= COLS ||
            newY >= ROWS ||
            (board[newY] && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function lockPiece() {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          board[currentPiece.y + y][currentPiece.x + x] =
            currentPiece.className;
        }
      });
    });
  }

  function clearLines() {
    let linesCleared = 0;
    outer: for (let y = ROWS - 1; y >= 0; y--) {
      for (let x = 0; x < COLS; x++) {
        if (!board[y][x]) {
          continue outer;
        }
      }
      const [removedRow] = board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      linesCleared++;
      y++;
    }
    if (linesCleared > 0) {
      const points = linesCleared * 10 * linesCleared;
      score += points;
      gameManager.addScore(points);
    }
  }

  // --- Drawing Functions ---
  function draw() {
    gameBoard.innerHTML = "";
    // Draw landed pieces
    board.forEach((row, y) => {
      row.forEach((className, x) => {
        if (className) {
          const cell = document.createElement("div");
          cell.className = `cell ${className}`;
          cell.style.gridRowStart = y + 1;
          cell.style.gridColumnStart = x + 1;
          gameBoard.appendChild(cell);
        }
      });
    });
    // Draw current piece
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const cell = document.createElement("div");
          cell.className = `cell ${currentPiece.className}`;
          cell.style.gridRowStart = currentPiece.y + y + 1;
          cell.style.gridColumnStart = currentPiece.x + x + 1;
          gameBoard.appendChild(cell);
        }
      });
    });
    // Score handled by GameManager
    drawNextPiece();
  }

  function drawNextPiece() {
    nextPieceGrid.innerHTML = "";
    const shape = nextPiece.shape;
    const offsetX = Math.floor((4 - shape[0].length) / 2);
    const offsetY = Math.floor((4 - shape.length) / 2);
    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const cell = document.createElement("div");
          cell.className = `cell ${nextPiece.className}`;
          cell.style.gridRowStart = y + offsetY + 1;
          cell.style.gridColumnStart = x + offsetX + 1;
          nextPieceGrid.appendChild(cell);
        }
      });
    });
  }

  // --- Movement & Rotation ---
  function move(dx, dy) {
    const testPiece = {
      ...currentPiece,
      x: currentPiece.x + dx,
      y: currentPiece.y + dy,
    };
    if (isValidMove(testPiece)) {
      currentPiece = testPiece;
    } else if (dy > 0) {
      // If move failed while going down, lock it
      lockPiece();
      clearLines();
      spawnNewPiece();
    }
  }

  function rotate() {
    const originalShape = currentPiece.shape;
    const newShape = originalShape[0].map((_, colIndex) =>
      originalShape.map((row) => row[colIndex]).reverse()
    );
    const testPiece = { ...currentPiece, shape: newShape };
    if (isValidMove(testPiece)) {
      currentPiece.shape = newShape;
    }
  }

  // --- Game Controls ---
  function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
  }

  function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    gameManager.resetScore();
    isGameOver = false;
    isPaused = false;
    pauseBtn.textContent = "Pause";
    nextPiece = getRandomPiece();
    spawnNewPiece();
    lastTime = 0; // Reset time for the loop
    gameManager.hideGameOver();
    if (!isGameOver) {
      gameLoop();
    }
  }

  // --- Game Loop ---
  function gameLoop(time = 0) {
    if (isGameOver) {
      return;
    }
    if (isPaused) {
      requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
      move(0, 1);
      dropCounter = 0;
    }

    draw();
    requestAnimationFrame(gameLoop);
  }

  // --- Event Listeners ---
  document.addEventListener("keydown", (e) => {
    if (isGameOver || isPaused) return;
    if (e.key === "ArrowLeft") move(-1, 0);
    if (e.key === "ArrowRight") move(1, 0);
    if (e.key === "ArrowDown") {
      dropCounter = dropInterval;
    } // Drop faster
    if (e.key === "ArrowUp") rotate();
  });

  // --- Touch & Mouse Control Logic ---
  function setupButtonControls(btn, action, isRepeatable = true) {
    let intervalId = null;
    let timeoutId = null;

    const startAction = (e) => {
      e.preventDefault(); // Prevent default touch behaviors
      if (isGameOver || isPaused) return;

      action(); // Trigger immediately

      if (isRepeatable) {
        // Delay before repeating starts
        timeoutId = setTimeout(() => {
          intervalId = setInterval(action, 100); // Repeat every 100ms
        }, 200);
      }
    };

    const endAction = (e) => {
      e.preventDefault();
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };

    // Touch events
    btn.addEventListener("touchstart", startAction, { passive: false });
    btn.addEventListener("touchend", endAction);
    btn.addEventListener("touchcancel", endAction);

    // Mouse events (for desktop testing/compatibility)
    btn.addEventListener("mousedown", startAction);
    btn.addEventListener("mouseup", endAction);
    btn.addEventListener("mouseleave", endAction);
  }

  setupButtonControls(leftBtn, () => move(-1, 0));
  setupButtonControls(rightBtn, () => move(1, 0));
  setupButtonControls(downBtn, () => (dropCounter = dropInterval)); // Fast drop
  setupButtonControls(rotateBtn, rotate, false); // Rotate usually isn't repeatable by holding

  pauseBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", resetGame);

  // --- Start Game ---
  resetGame();
});

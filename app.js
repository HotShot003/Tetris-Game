const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const board = [];
const bgm = document.createElement("audio");
const breakSound = document.createElement("audio");
const drop = document.createElement("audio");
let rotatedShape;



// Initialize the board
for (let row = 0; row < BOARD_HEIGHT; row++) {
  board[row] = [];
  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = 0;
  }
}

// Tetrominoes
const tetrominoes = [
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffd800",
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
    color: "#7925DD",
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0],
    ],
    color: "orange",
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4],
    ],
    color: "red",
  },
  {
    shape: [
      [5, 0, 0],
      [5, 5, 5],
    ],
    color: "green",
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6],
    ],
    color: "#ff6400 ",
  },
  { shape: [[7, 7, 7, 7]], color: "#00b5ff" },
];

// Tetromino randomizer
function randomTetromino() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  const tetromino = tetrominoes[index];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    row: 0,
    col: Math.floor(Math.random() * (BOARD_WIDTH - tetromino.shape[0].length + 1)),
  };
}

// Current tetromino
let currentTetromino = randomTetromino();
let currentGhostTetromino;

// Draw tetromino
function drawTetromino() {
  const shape = currentTetromino.shape;
  const color = currentTetromino.color;
  const row = currentTetromino.row;
  const col = currentTetromino.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.backgroundColor = color;
        block.style.top = (row + r) * 24 + "px";
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `block-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

// Erase tetromino from the board
function eraseTetromino() {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        let block = document.getElementById(`block-${row}-${col}`);

        if (block) {
          document.getElementById("game_board").removeChild(block);
        }
      }
    }
  }
}

// Check if tetromino can move in the specified direction
function canTetrominoMove(rowOffset, colOffset) {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i + rowOffset;
        let col = currentTetromino.col + j + colOffset;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

// Check if tetromino can rotate
function canTetrominoRotate() {
  for (let i = 0; i < rotatedShape.length; i++) {
    for (let j = 0; j < rotatedShape[i].length; j++) {
      if (rotatedShape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

// Lock the tetromino in place
function lockTetromino() {
  // Add the tetromino to the board
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        board[row][col] = currentTetromino.color;
      }
    }
  }

  // Check if any rows need to be cleared
  let rowsCleared = clearRows();
  if (rowsCleared > 0) {
    // Play break sound and update score
    breakSound.play();
    updateScore(rowsCleared);
  }

  // Create a new tetromino
  currentTetromino = randomTetromino();
  drawGhostTetromino();
}

// Clear filled rows and move everything down
function clearRows() {
  let rowsCleared = 0;

  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    let isRowFull = true;

    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (board[row][col] === 0) {
        isRowFull = false;
        break;
      }
    }

    if (isRowFull) {
      rowsCleared++;
      // Move all rows above down by one
      for (let r = row; r > 0; r--) {
        for (let c = 0; c < BOARD_WIDTH; c++) {
          board[r][c] = board[r - 1][c];
          // Update the block position in the DOM
          let blockAbove = document.getElementById(`block-${r - 1}-${c}`);
          if (blockAbove) {
            blockAbove.style.top = r * 24 + "px";
            blockAbove.setAttribute("id", `block-${r}-${c}`);
          }
        }
      }

      // Clear the top row
      for (let c = 0; c < BOARD_WIDTH; c++) {
        board[0][c] = 0;
        let blockTop = document.getElementById(`block-0-${c}`);
        if (blockTop) {
          document.getElementById("game_board").removeChild(blockTop);
        }
      }

      row++; // Recheck the current row
    }
  }

  return rowsCleared;
}

// Draw the ghost tetromino (the shadow showing where the tetromino will land)
function drawGhostTetromino() {
  // Remove the previous ghost
  if (currentGhostTetromino) {
    eraseTetromino();
  }

  // Copy current tetromino
  currentGhostTetromino = JSON.parse(JSON.stringify(currentTetromino));

  // Drop the ghost to the bottom
  while (canTetrominoMove(1, 0)) {
    currentGhostTetromino.row++;
  }

  // Draw the ghost tetromino
  drawTetromino();
}

// Update score (placeholder function)
function updateScore(rowsCleared) {
  // Update the score based on the number of rows cleared
  console.log(`Rows cleared: ${rowsCleared}`);
}

// Start the game (for demo purposes, triggering the first tetromino draw)
drawTetromino();

// 1) Game Board SetUp

const board_width = 18;
const board_height = 24;

const board = [];

const breakSound = document.createElement("audio");

let roratedShape;

for(let row=0;row<board_height;row++){
  board[row] = [];
  for (let col = 0; col < board_width; col++) {
    board[row][col] = 0
    
  }
}


// 2) Tetrominoes Array

const tetrominoes = [
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "red", // O-Tetromino
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
    color: "blue", // T-Tetromino
  },
  {
    shape: [
      [3, 3, 3, 3],
    ],
    color: "cyan", // I-Tetromino
  },
  {
    shape: [
      [4, 0, 0],
      [4, 4, 4],
    ],
    color: "orange", // L-Tetromino
  },
  {
    shape: [
      [0, 0, 5],
      [5, 5, 5],
    ],
    color: "yellow", // J-Tetromino
  },
  {
    shape: [
      [0, 6, 6],
      [6, 6, 0],
    ],
    color: "green", // S-Tetromino
  },
  {
    shape: [
      [7, 7, 0],
      [0, 7, 7],
    ],
    color: "purple", // Z-Tetromino
  },
];


// 3) Random Tetromino Function

function randTetromino(){
  const index = Math.floor(Math.random()* tetrominoes.length);
  const tetromino = tetrominoes[index];
  return{
    shape:tetromino.shape,
    color:tetromino.color,
    row:0,
    col:Math.floor(Math.random() * ( board_width - tetromino.shape[0].length + 1)),
    
  }
}

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

function canTetrominoRotate() {
  for (let i = 0; i < roratedShape.length; i++) {
    for (let j = 0; j < roratedShape[i].length; j++) {
      if (roratedShape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;

        if (row >= board_height || col < 0 || col >= board_width || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}
function rotateTetromino() {
  rotatedShape = [];
  for (let i = 0; i < currentTetromino.shape[0].length; i++) {
    let row = [];
    for (let j = currentTetromino.shape.length - 1; j >= 0; j--) {
      row.push(currentTetromino.shape[j][i]);
    }
    rotatedShape.push(row);
  }

  if (canTetrominoRotate()) {
    eraseTetromino();
    currentTetromino.shape = rotatedShape;
    drawTetromino();
  }

  moveGhostTetromino();
}
function lockTetromino() {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        board[row][col] = currentTetromino.color;
      }
    }
  }

  let rowsCleared = clearRows();
  if (rowsCleared > 0) {
    // Optionally, handle row clearing effects here
  }

  currentTetromino = randomTetromino();
  drawTetromino();

  if (!canTetrominoMove(1, 0)) {
    gameOver();
  }
}

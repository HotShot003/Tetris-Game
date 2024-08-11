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
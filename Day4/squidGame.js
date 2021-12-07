const fs = require("fs");

const data = fs.readFileSync("./input.txt", "utf-8");

// format data into an array of numbers to be called, and 2D board arrays
function formatInputs(data) {
  const parsedData = data.split("\n").filter((d) => !!d);

  const numbers = parsedData[0].split(",").map((n) => parseInt(n));
  const boardStrings = parsedData.slice(1);

  let boards = [];
  let board = [];

  for (let i = 0; i < boardStrings.length; i++) {
    board.push(
      boardStrings[i]
        .split(" ")
        .filter((v) => !!v)
        .map((v) => parseInt(v))
    );
    if (board.length === 5) {
      boards.push(board);
      board = [];
    }
  }

  return { numbers, boards };
}

const { numbers, boards } = formatInputs(data);

// Part 1: find the first board that will win with the given input and calculate winning score

function checkForBingo(board) {
  let isBingo = false;

  // first check each row for bingo
  board.forEach((row) => {
    if (row.every((e) => e === 0)) {
      isBingo = true;
    }
  });

  // if we don't have a bingo check the columns now
  for (let i = 0; i < 5; i++) {
    const column = [
      board[0][i],
      board[1][i],
      board[2][i],
      board[3][i],
      board[4][i],
    ];
    if (column.every((e) => e === 0)) {
      isBingo = true;
    }
  }

  return isBingo;
}

function getTurnsToWin(board, nums) {
  const boardCopy = [...board];
  let turns = 0;
  let lastDrawnNumber;
  let isBingo = false;

  for (let i = 0; i < nums.length; i++) {
    turns++;
    for (let j = 0; j < 5; j++) {
      const index = boardCopy[j].findIndex((e) => e === nums[i]);
      if (index !== -1) {
        boardCopy[j][index] = 0;
        break;
      }
    }
    if (i >= 5) {
      isBingo = checkForBingo(boardCopy);
    }
    if (isBingo) {
      lastDrawnNumber = nums[i];
      break;
    }
  }

  return { boardCopy, turns, lastDrawnNumber };
}

function findFirstWinningBoard(nums, boards) {
  let bestBoard;
  let currentLowestTurns = nums.length;
  let finalNumber;

  // loop through each board
  for (let i = 0; i < boards.length; i++) {
    // for each board determine how mny steps to win, set the boardIndex and turns required if < current turns required
    const { turns, boardCopy, lastDrawnNumber } = getTurnsToWin(
      boards[i],
      nums
    );

    if (turns < currentLowestTurns) {
      currentLowestTurns = turns;
      bestBoard = boardCopy;
      finalNumber = lastDrawnNumber;
    }
  }

  return { bestBoard, finalNumber };
}

function calculateScore(board, multiplier) {
  const flattenedBoard = board.flat();
  return flattenedBoard.reduce((a, c) => a + c) * multiplier;
}

// make a copy to prevent the original from being modified and messing up part 2
const boardsCopy = JSON.parse(JSON.stringify(boards));

const { bestBoard, finalNumber } = findFirstWinningBoard(numbers, boardsCopy);
console.log("Winning score: ", calculateScore(bestBoard, finalNumber));

// Part 2: Pick the last board to win and calculate the score

function findLastWinningBoard(nums, boards) {
  let worstBoard;
  let currentHighestTurns = 0;
  let finalNum;

  // loop through each board
  for (let i = 0; i < boards.length; i++) {
    // for each board determine how mny steps to win, set the boardIndex and turns required if < current turns required
    const { turns, boardCopy, lastDrawnNumber } = getTurnsToWin(
      boards[i],
      nums
    );

    if (turns > currentHighestTurns) {
      currentHighestTurns = turns;
      worstBoard = boardCopy;
      finalNum = lastDrawnNumber;
    }
  }

  return { worstBoard, finalNum };
}

const { worstBoard, finalNum } = findLastWinningBoard(numbers, boards);

console.log("Losing score: ", calculateScore(worstBoard, finalNum));

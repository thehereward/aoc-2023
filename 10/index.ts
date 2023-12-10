import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3, getNSEW } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
var lines = data.map((line) => line.split(""));

const xMax = lines[0].length - 1;
const yMax = lines.length - 1;

// console.log({ xMax, yMax });

let start: string = "";
let startCoords: number[] = [];
const grid: Record<string, string> = {};
for (var yy = -1; yy <= yMax; yy++) {
  for (var xx = -1; xx <= xMax; xx++) {
    grid[toKey(xx, yy)] = ".";
  }
}
lines.forEach((line, y) => {
  line.forEach((char, x) => {
    grid[toKey(x, y)] = char;
    if (char == "S") {
      start = toKey(x, y);
      startCoords = [y, x];
    }
  });
});

// console.log(grid);

const visited: Record<string, number> = {};
visited[start] = 0;

var currentCell = startCoords;

var cellsToVisit = [currentCell];

while (cellsToVisit.length > 0) {
  const cell = cellsToVisit.shift();
  if (!cell) {
    break;
  }
  const newCells = getConnectedCells(cell);
  newCells.forEach((c) => cellsToVisit.push(c));
}

function followPath(currentCell: number[] | [number, number]) {
  const visitableCells = getConnectedCells(currentCell);
  if (visitableCells.length == 0) {
    return;
  }
  visitableCells.forEach((cell) => followPath(cell));
}

// followPath(currentCell);

const keys = Object.keys(visited);
var maxRange: number = -Infinity;
keys.forEach((key) => {
  const value = visited[key];
  maxRange = Math.max(maxRange, value);
});
console.log(maxRange);

logTime("Part 1");

// const numberOfCellsInLoop = Object.keys(visited).length
// const toFlood = [[0,0], [0,yMax], [max]]

const cellsInsidebyX: Record<string, boolean> = {};
const cellsInsidebyY: string[] = [];

const allCharsX: string[][] = [];
for (var y = 0; y <= yMax; y++) {
  var lastXWasLoop = false;
  var inLoopX = false;
  const chars: string[] = [];

  for (var x = 0; x <= xMax; x++) {
    const key = toKey(x, y);
    const char = grid[key];
    // const charNext = grid[toKey(x + 1, y)];
    var enteringLoopX = false;
    const currentCharIsLoop = isLoop(char);

    if (!inLoopX) {
      if (currentCharIsLoop) {
        enteringLoopX = true;
      }
    } else {
      if (currentCharIsLoop) {
        inLoopX = false;
      }
    }

    chars.push(inLoopX ? "I" : char);
    if (inLoopX) {
      cellsInsidebyX[key] = true;
    }

    if (enteringLoopX) {
      inLoopX = true;
    }
    lastXWasLoop = isLoop(char);
  }
  allCharsX.push(chars);
}

const allCharsY: string[][] = [];
for (var x = 0; x <= xMax; x++) {
  var lastXWasLoop = false;
  var inLoopX = false;
  const chars: string[] = [];

  for (var y = 0; y <= yMax; y++) {
    const key = toKey(x, y);
    const char = grid[key];
    // const charNext = grid[toKey(x + 1, y)];
    var enteringLoopX = false;
    const currentCharIsLoop = isLoop(char);

    if (!inLoopX) {
      if (currentCharIsLoop) {
        enteringLoopX = true;
      }
    } else {
      if (currentCharIsLoop) {
        inLoopX = false;
      }
    }

    chars.push(inLoopX ? "I" : char);

    if (inLoopX && cellsInsidebyX[key]) {
      cellsInsidebyY.push(key);
    }

    if (enteringLoopX) {
      inLoopX = true;
    }
    lastXWasLoop = isLoop(char);
  }
  allCharsY.push(chars);
}

console.log(cellsInsidebyY.length);

logTime("Part 2");

export {};
function isLoop(char: string) {
  return char != ".";
}

function getConnectedCells(currentCell: number[] | [number, number]) {
  const [y, x] = currentCell;
  const currentKey = toKey(x, y);
  const currentChar = grid[currentKey];
  const currentCount = visited[currentKey];
  const toVisit = getNSEW(x, y);

  const connectedCells = toVisit.filter((cell, i) => {
    const [y, x] = cell;
    const key = toKey(x, y);
    const char = grid[key];
    var isConnected: boolean = false;
    switch (i) {
      case 0: // N
        isConnected = connectsSouth(char) && connectsNorth(currentChar);
        break;
      case 1: // S
        isConnected = connectsNorth(char) && connectsSouth(currentChar);
        break;
      case 2: // E
        isConnected = connectsWest(char) && connectsEast(currentChar);
        break;
      case 3: // W
        isConnected = connectsEast(char) && connectsWest(currentChar);
        break;
    }
    return isConnected;
  });
  const visitableCells = connectedCells.filter((cell) => {
    const [y, x] = cell;
    const key = toKey(x, y);
    const newCount = currentCount + 1;
    if (visited[key] != undefined && visited[key] <= newCount) {
      return false;
    } else {
      visited[key] = newCount;
      return true;
    }
  });
  return visitableCells;
}

function connectsNorth(char: string): boolean {
  return char == "|" || char == "J" || char == "L" || char == "S";
}

function connectsSouth(char: string) {
  return char == "|" || char == "7" || char == "F" || char == "S";
}

function connectsEast(char: string): boolean {
  return char == "-" || char == "L" || char == "F" || char == "S";
}

function connectsWest(char: string) {
  return char == "-" || char == "7" || char == "J" || char == "S";
}

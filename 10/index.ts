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
const allSegmentsX: number[][] = [];
for (var y = 0; y <= yMax; y++) {
  var lastXWasLoop = false;
  var inLoopX = false;
  const chars: string[] = [];
  const segmentsToWest: number[] = [];
  var previousSegments = 0;

  for (var x = 0; x <= xMax; x++) {
    const key = toKey(x, y);
    const char = grid[key];
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

    if (enteringLoopX) {
      inLoopX = true;
    }
    if (isLoop(char) && !connectsEast(char)) {
      previousSegments++;
    }
    segmentsToWest.push(isLoop(char) ? NaN : previousSegments);
    lastXWasLoop = isLoop(char);
  }
  allCharsX.push(chars);
  allSegmentsX.push(segmentsToWest);
}

const allCharsEast: string[][] = [];
const allSegmentsEast: number[][] = [];
for (var y = 0; y <= yMax; y++) {
  var lastXWasLoop = false;
  var inLoopX = false;
  const chars: string[] = [];
  const segmentsToEast: number[] = [];
  var previousSegments = 0;

  for (var x = xMax; x >= 0; x--) {
    const key = toKey(x, y);
    const char = grid[key];
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

    if (enteringLoopX) {
      inLoopX = true;
    }
    if (isLoop(char) && !connectsWest(char)) {
      previousSegments++;
    }
    segmentsToEast.push(isLoop(char) ? NaN : previousSegments);
    lastXWasLoop = isLoop(char);
  }
  allCharsEast.push(chars.reverse());
  allSegmentsEast.push(segmentsToEast.reverse());
}

// allCharsX.forEach((chars) => console.log(chars.join("")));

const allCharsY: string[][] = [];
const allSegmentsY: number[][] = [];
for (var x = 0; x <= xMax; x++) {
  var lastXWasLoop = false;
  var inLoopX = false;
  const chars: string[] = [];
  const segmentsToWest: number[] = [];
  var previousSegments = 0;

  for (var y = 0; y <= yMax; y++) {
    const key = toKey(x, y);
    const char = grid[key];
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

    if (enteringLoopX) {
      inLoopX = true;
    }
    if (isLoop(char) && !connectsSouth(char)) {
      previousSegments++;
    }
    segmentsToWest.push(isLoop(char) ? NaN : previousSegments);
    lastXWasLoop = isLoop(char);
  }
  allCharsY.push(chars);
  allSegmentsY.push(segmentsToWest);
}
const mapped = allSegmentsY[0].map((_, colIndex) =>
  allSegmentsY.map((row) => row[colIndex])
);

const allCharsSouth: string[][] = [];
const allSegmentsSouth: number[][] = [];
for (var x = 0; x <= xMax; x++) {
  var lastXWasLoop = false;
  var inLoopX = false;
  const chars: string[] = [];
  const segmentsToWest: number[] = [];
  var previousSegments = 0;

  for (var y = yMax; y >= 0; y--) {
    const key = toKey(x, y);
    const char = grid[key];
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

    if (enteringLoopX) {
      inLoopX = true;
    }
    if (isLoop(char) && !connectsSouth(char)) {
      previousSegments++;
    }
    segmentsToWest.push(isLoop(char) ? NaN : previousSegments);
    lastXWasLoop = isLoop(char);
  }
  allCharsSouth.push(chars.reverse());
  allSegmentsSouth.push(segmentsToWest.reverse());
}
const mappedSouth = allSegmentsSouth[0].map((_, colIndex) =>
  allSegmentsSouth.map((row) => row[colIndex])
);

const output: number[][] = [];
for (var y = 0; y <= yMax; y++) {
  output.push([]);
  for (var x = 0; x <= xMax; x++) {
    const w = allSegmentsX[y][x];
    const n = mapped[y][x];
    const e = allSegmentsEast[y][x];
    const s = mappedSouth[y][x];

    var char = 0;
    if (w == 0 || n == 0 || e == 0 || s == 0) {
      setTo0(x, y);
      char = 0;
    } else if (isEven(w) && isEven(e)) {
      setTo0(x, y);
      char = 0;
    } else if (isEven(n) && isEven(s)) {
      setTo0(x, y);
      char = 0;
    } else {
      char = 1;
    }
    //  else if (a % 2 == 0 && b % 2 == 0 && c % 2 == 0 && d % 2 == 0) {
    //   allSegmentsX[y][x] = 0;
    //   mapped[y][x] = 0;
    //   allSegmentsEast[y][x] = 0;
    //   mappedSouth[y][x] = 0;

    //   char = 0;
    // }
    output[y].push(char);
  }
}

function isEven(x: number) {
  return x % 2 == 0;
}

function setTo0(x: number, y: number) {
  allSegmentsX[y][x] = 0;
  mapped[y][x] = 0;
  allSegmentsEast[y][x] = 0;
  mappedSouth[y][x] = 0;
}

function print(num: number): string {
  if (isNaN(num)) {
    return ".";
  } else {
    return num.toString();
  }
}

allSegmentsX.forEach((chars) => console.log(chars.map(print).join("")));
console.log("");
mapped.forEach((chars) => console.log(chars.map(print).join("")));
console.log("");
allSegmentsEast.forEach((chars) => console.log(chars.map(print).join("")));
console.log("");
mappedSouth.forEach((chars) => console.log(chars.map(print).join("")));

const oooo = mappedSouth
  .flatMap((line) => line)
  .filter((x) => !isNaN(x) && x > 0);
console.log(oooo.length);

// for (var x = 0; x <= xMax; x++) {
//   var lastXWasLoop = false;
//   var inLoopX = false;
//   const chars: string[] = [];

//   for (var y = 0; y <= yMax; y++) {
//     const key = toKey(x, y);
//     const char = grid[key];
//     // const charNext = grid[toKey(x + 1, y)];
//     var enteringLoopX = false;
//     const currentCharIsLoop = isLoop(char);

//     if (!inLoopX) {
//       if (currentCharIsLoop) {
//         enteringLoopX = true;
//       }
//     } else {
//       if (currentCharIsLoop) {
//         inLoopX = false;
//       }
//     }

//     chars.push(inLoopX ? "I" : char);

//     if (inLoopX && cellsInsidebyX[key]) {
//       cellsInsidebyY.push(key);
//     }

//     if (enteringLoopX) {
//       inLoopX = true;
//     }
//     lastXWasLoop = isLoop(char);
//   }
//   allCharsY.push(chars);
// }

// console.log(cellsInsidebyY.length);

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

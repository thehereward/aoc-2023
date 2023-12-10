import { sum, max } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3, getNSEW, printGrid } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
var lines = data.map((line) => line.split(""));

const xMax = lines[0].length - 1;
const yMax = lines.length - 1;

let start: string = "";
let startCoords: number[] = [];
const grid: Record<string, string> = {};
lines.forEach((line, y) => {
  line.forEach((char, x) => {
    grid[toKey(x, y)] = char;
    if (char == "S") {
      start = toKey(x, y);
      startCoords = [y, x];
    }
  });
});

const visited: Record<string, number> = {};
visited[start] = 0;

var cellsToVisit = [startCoords];
while (cellsToVisit.length > 0) {
  const cell = cellsToVisit.shift();
  if (!cell) {
    break;
  }
  const newCells = getConnectedCells(cell);
  cellsToVisit.push(...newCells);
}

const maxRange = Object.values(visited).reduce(max);
console.log(maxRange);

logTime("Part 1");

function mapTo3x3(x: number, y: number, char: string): any[][] {
  switch (char) {
    case ".":
      return [
        [y, x, char],
        [y + 1, x, ","],
        [y - 1, x, ","],
        [y, x + 1, ","],
        [y + 1, x + 1, ","],
        [y - 1, x + 1, ","],
        [y, x - 1, ","],
        [y + 1, x - 1, ","],
        [y - 1, x - 1, ","],
      ];
    case "|":
      return [
        [y, x, char],
        [y + 1, x, "|"],
        [y - 1, x, "|"],
        [y, x + 1, ","],
        [y + 1, x + 1, ","],
        [y - 1, x + 1, ","],
        [y, x - 1, ","],
        [y + 1, x - 1, ","],
        [y - 1, x - 1, ","],
      ];
    case "-":
      return [
        [y, x, char],
        [y + 1, x, ","],
        [y - 1, x, ","],
        [y, x + 1, "-"],
        [y + 1, x + 1, ","],
        [y - 1, x + 1, ","],
        [y, x - 1, "-"],
        [y + 1, x - 1, ","],
        [y - 1, x - 1, ","],
      ];
    case "F":
      return [
        [y, x, char],
        [y + 1, x, "|"],
        [y - 1, x, ","],
        [y, x + 1, "-"],
        [y + 1, x + 1, ","],
        [y - 1, x + 1, ","],
        [y, x - 1, ","],
        [y + 1, x - 1, ","],
        [y - 1, x - 1, ","],
      ];
    case "7":
      return [
        [y, x, char],
        [y + 1, x, "|"],
        [y - 1, x, ","],
        [y, x + 1, ","],
        [y + 1, x + 1, ","],
        [y - 1, x + 1, ","],
        [y, x - 1, "-"],
        [y + 1, x - 1, ","],
        [y - 1, x - 1, ","],
      ];
    case "J":
      return [
        [y, x, char],
        [y + 1, x, ","],
        [y - 1, x, "|"],
        [y, x + 1, ","],
        [y + 1, x + 1, ","],
        [y - 1, x + 1, ","],
        [y, x - 1, "-"],
        [y + 1, x - 1, ","],
        [y - 1, x - 1, ","],
      ];
    case "L":
      return [
        [y, x, char],
        [y + 1, x, ","],
        [y - 1, x, "|"],
        [y, x + 1, "-"],
        [y + 1, x + 1, ","],
        [y - 1, x + 1, ","],
        [y, x - 1, ","],
        [y + 1, x - 1, ","],
        [y - 1, x - 1, ","],
      ];
    case "S":
      return [
        [y, x, char],
        [y + 1, x, "S"],
        [y - 1, x, "S"],
        [y, x + 1, "S"],
        [y + 1, x + 1, "S"],
        [y - 1, x + 1, "S"],
        [y, x - 1, "S"],
        [y + 1, x - 1, "S"],
        [y - 1, x - 1, "S"],
      ];
  }
  return [];
}

const toBigCood = (x: number) => x * 3 + 1;

const bigGridKey: Record<string, string> = {};
for (var y = 0; y <= yMax; y++) {
  for (var x = 0; x <= xMax; x++) {
    const char = grid[toKey(x, y)];
    const newChars = mapTo3x3(toBigCood(x), toBigCood(y), char);
    newChars.forEach((arr) => {
      const [y, x, char] = arr;
      bigGridKey[toKey(x, y)] = char;
    });
  }
}

const bigGridMaxY = (yMax + 1) * 3;
const bigGridMaxX = (xMax + 1) * 3;

const floodStartCells = get0To(bigGridMaxX).map((x) => [0, x]);

logTime("Before the flood");
flood(floodStartCells, "#");
logTime("After the flood");

function flood(start: number[][], withString: string, ignore: string = "") {
  var toFill = start;

  do {
    toFill = toFill.flatMap((cell) => {
      const [y, x] = cell;
      bigGridKey[toKey(x, y)] = withString;
      const cells = get3By3(x, y);
      const newCells = cells.filter((cell) => {
        const [y, x] = cell;
        if (y < 0 || x < 0 || y > bigGridMaxY || x > bigGridMaxX) {
          return false;
        }
        const char = bigGridKey[toKey(x, y)];
        if (char == "." || char == ",") {
          bigGridKey[toKey(x, y)] = withString;
          return true;
        } else if (char == ignore) {
          return false;
        } else {
          bigGridKey[toKey(x, y)] = withString;
          return false;
        }
      });
      return newCells;
    });
  } while (toFill.length > 0);
}

const actualChars: string[] = [];
for (var y = 0; y <= yMax; y++) {
  for (var x = 0; x <= xMax; x++) {
    const key = toKey(toBigCood(x), toBigCood(y));
    actualChars.push(bigGridKey[key] || " ");
  }
}

const answer = actualChars.filter(
  (char) => char != "," && char != "#" && char != "S" && char != " "
).length;

console.log(answer);

logTime("Part 2");

export {};

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

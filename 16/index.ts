import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3, printGrid } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const grid = data.map((line) => line.split(""));

const xMax = grid[0].length;
const yMax = grid.length;

const start = [0, 0, 0];

const part1 = fireBeam(start, newGrid());

console.log({ part1 });

function newGrid(): string[][] {
  return JSON.parse(JSON.stringify(grid));
}

function fireBeam(initialBeam: number[], grid: string[][]) {
  var beamHeads = [initialBeam];

  const visitedSet = new Set<string>();
  const uniqueTiles = new Set<string>();

  while (beamHeads.length > 0) {
    const [beamHead, ...rest] = beamHeads;
    if (visitedSet.has(beamHead.toString())) {
      // We've seen this before, we can skip it
      beamHeads = rest;
      continue;
    }

    const [x, y, direction] = beamHead;
    if (x < 0 || y < 0 || x >= xMax || y >= yMax) {
      // out of bounds, beam is lost
      beamHeads = rest;
      continue;
    }

    visitedSet.add(beamHead.toString());
    uniqueTiles.add(toKey(x, y));

    const tile = grid[y][x];

    switch (tile) {
      case ".":
        // Continue
        rest.push(advance(x, y, direction));
        break;
      case "/":
        rest.push(reflectA(x, y, direction));
        break;
      case "\\":
        rest.push(reflectB(x, y, direction));
        break;
      case "-":
        rest.push(...splitHorizontal(x, y, direction));
        break;
      case "|":
        rest.push(...splitVertical(x, y, direction));
        break;
    }
    beamHeads = rest;
  }
  return uniqueTiles.size;
}

function reflectA(x: number, y: number, direction: number) {
  switch (direction) {
    case 0: // East
      return [x, y - 1, 3];
    case 1: // South
      return [x - 1, y, 2];
    case 2: // West
      return [x, y + 1, 1];
    case 3: // North
      return [x + 1, y, 0];
    default:
      console.log("tried to advance");
      return [];
  }
}

function reflectB(x: number, y: number, direction: number) {
  switch (direction) {
    case 0: // East
      return [x, y + 1, 1];
    case 1: // South
      return [x + 1, y, 0];
    case 2: // West
      return [x, y - 1, 3];
    case 3: // North
      return [x - 1, y, 2];
    default:
      console.log("tried to advance");
      return [];
  }
}

function splitHorizontal(x: number, y: number, direction: number) {
  switch (direction) {
    case 0: // East
      return [[x + 1, y, direction]];
    case 2: // West
      return [[x - 1, y, direction]];
    case 1: // South
    case 3: // North
      return [
        [x + 1, y, 0],
        [x - 1, y, 2],
      ];
    default:
      console.log("tried to advance");
      return [];
  }
}

function splitVertical(x: number, y: number, direction: number) {
  switch (direction) {
    case 0: // East
    case 2: // West
      return [
        [x, y - 1, 3],
        [x, y + 1, 1],
      ];
    case 1: // South
      return [[x, y + 1, direction]];
    case 3: // North
      return [[x, y - 1, direction]];
    default:
      console.log("tried to advance");
      return [];
  }
}

function advance(x: number, y: number, direction: number) {
  switch (direction) {
    case 0: // East
      return [x + 1, y, direction];
    case 1: // South
      return [x, y + 1, direction];
    case 2: // West
      return [x - 1, y, direction];
    case 3: // North
      return [x, y - 1, direction];
    default:
      console.log("tried to advance");
      return [];
  }
}

logTime("Part 1");

const answerMap = new Map<number[], number>();

// top / bottom
for (var i = 0; i < xMax; i++) {
  const startTop = [i, 0, 1];
  answerMap.set(startTop, fireBeam(startTop, newGrid()));
  const startBottom = [i, yMax - 1, 3];
  answerMap.set(startBottom, fireBeam(startBottom, newGrid()));
}

// left / right
for (var i = 0; i < yMax; i++) {
  const startLeft = [0, i, 0];
  answerMap.set(startLeft, fireBeam(startLeft, newGrid()));
  const startRight = [xMax - 1, i, 2];
  answerMap.set(startRight, fireBeam(startRight, newGrid()));
}

const answers: number[][] = [];
for (const answer of answerMap.entries()) {
  answers.push([...answer[0], answer[1]]);
}

answers.sort((a, b) => {
  return b[3] - a[3];
});

const part2 = answers[0][3];
console.log({ part2 });

logTime("Part 2");

export {};

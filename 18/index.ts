import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const lines = data.map((line) => line.split(" "));
const instructions = lines.map((line) => {
  return {
    direction: line[0],
    length: parseInt(line[1]),
    colour: line[2].slice(2, 8),
  };
});
// console.log({ instructions });

const points = getPoints(instructions);

var {
  yMax,
  xMax,
  allPoints,
}: { yMax: number; xMax: number; allPoints: Set<string> } = normalize(points);

function normalize(points: number[][]) {
  var yMin = Infinity;
  var xMin = Infinity;

  points.forEach((point) => {
    const [y, x] = point;
    yMin = Math.min(yMin, y);
    xMin = Math.min(xMin, x);
  });

  const grid = points.map((point) => {
    const [y, x] = point;
    return [y - yMin + 1, x - xMin + 1];
  });

  var yMax = -Infinity;
  var xMax = -Infinity;

  grid.forEach((point) => {
    const [y, x] = point;
    yMax = Math.max(yMax, y);
    xMax = Math.max(xMax, x);
  });

  const allPoints: Set<string> = new Set();
  grid.forEach((point) => {
    const [y, x] = point;

    allPoints.add(toKey(x, y));
  });
  return { yMax, xMax, allPoints };
}

function getPoints(instructions: { direction: string; length: number }[]) {
  var point = [-1, -1];

  const points = [point];
  instructions.forEach((instruction) => {
    const { direction, length } = instruction;
    for (var i = 0; i < length; i++) {
      point = getNextPoint(point, direction);
      points.push(point);
    }
  });
  return points;
}

function printGrid(allPoints: Set<string>) {
  for (var y = 0; y <= yMax + 1; y++) {
    const row: string[] = [];
    for (var x = 0; x <= xMax + 1; x++) {
      row.push(allPoints.has(toKey(x, y)) ? "#" : ".");
    }
    console.log(row.join(""));
  }
}

var fillFrom = [
  [0, 0],
  [yMax + 1, xMax + 1],
];

const floodedCells: Set<string> = fill(fillFrom, allPoints, xMax, yMax);

const size = (yMax + 2) * (xMax + 2);
const part1 = size - floodedCells.size;
console.log({ part1 });

function fill(
  start: number[][],
  allPoints: Set<string>,
  xMax: number,
  yMax: number
) {
  const floodedCells: Set<string> = new Set();

  var fillFrom: number[][] = JSON.parse(JSON.stringify(start));
  fillFrom.forEach((cell) => {
    const [y, x] = cell;
    floodedCells.add(toKey(x, y));
  });

  while (fillFrom.length > 0) {
    // logTime(floodedCells.size.toString());
    fillFrom = fillFrom.flatMap((cell) => {
      const [y, x] = cell;
      const cells = get3By3(x, y).filter((cell) => {
        const [y, x] = cell;
        if (y < 0 || x < 0 || y > yMax + 1 || x > xMax + 1) {
          return false;
        }
        if (floodedCells.has(toKey(x, y))) {
          return false;
        }
        if (allPoints.has(toKey(x, y))) {
          return false;
        }

        return true;
      });
      cells.forEach((cell) => {
        const [y, x] = cell;
        floodedCells.add(toKey(x, y));
      });
      return cells;
    });
  }
  return floodedCells;
}

function getNextPoint(point: number[], direction: string): number[] {
  const [y, x] = point;
  switch (direction) {
    case "R":
      return [y, x + 1];
    case "D":
      return [y + 1, x];
    case "L":
      return [y, x - 1];
    case "U":
      return [y - 1, x];
    default:
      throw new Error(direction);
  }
}

logTime("Part 1");

const part2Instructions = instructions.map((instruction) => {
  const { colour } = instruction;
  const length = parseInt(colour.slice(0, 5), 16);
  const direction = dirToDirection(colour.slice(5));
  console.log(length, direction);
  return {
    length,
    direction,
  };
});

logTime("Have instructions");
const part2Points = getPoints(part2Instructions);
logTime("Have points");

const part2: { yMax: number; xMax: number; allPoints: Set<string> } =
  normalize(part2Points);
logTime("Have normalised");

var fillFrom = [
  [0, 0],
  [part2.yMax + 1, part2.xMax + 1],
];

const part2Flooded: Set<string> = fill(
  fillFrom,
  part2.allPoints,
  part2.xMax,
  part2.yMax
);
logTime("Have flooded");
const size2 = (part2.yMax + 2) * (part2.xMax + 2);
const part2a = size2 - part2Flooded.size;
console.log({ part2: part2a });

// console.log(part2);

function dirToDirection(s: string) {
  switch (s) {
    case "0":
      return "R";
    case "1":
      return "D";
    case "2":
      return "L";
    case "3":
      return "U";
    default:
      throw new Error();
  }
}

logTime("Part 2");

export {};

import { readFile, getTimeLogger } from "../common";

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

function getNextPoint(
  point: number[],
  direction: string,
  length = 1
): number[] {
  const [y, x] = point;
  switch (direction) {
    case "R":
      return [y, x + length];
    case "D":
      return [y + length, x];
    case "L":
      return [y, x - length];
    case "U":
      return [y - length, x];
    default:
      throw new Error(direction);
  }
}

const part1 = getArea(instructions);
console.log(part1);

logTime("Part 1");

const part2Instructions = instructions.map((instruction) => {
  const { colour } = instruction;
  const length = parseInt(colour.slice(0, 5), 16);
  const direction = dirToDirection(colour.slice(5));
  return {
    length,
    direction,
  };
});

const part2 = getArea(part2Instructions);
console.log(part2);

function getArea(instructions: { length: number; direction: string }[]) {
  const points2 = getAllPoints(instructions);

  var insideArea: number = 0;
  var outsideArea: number = 0;
  for (var i = 0; i < points2.length - 1; i++) {
    const a = points2[i];
    const b = points2[i + 1];
    const [y1, x1] = a;
    const [y2, x2] = b;
    const area = x1 * y2 - x2 * y1;
    insideArea += area;
    const edge = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1) - 1;
    outsideArea += edge;
  }

  return insideArea / 2 + outsideArea / 2 + 1;
}

function getAllPoints(instructions: { length: number; direction: string }[]) {
  var [y1, x1] = [0, 0];
  const points: number[][] = [[0, 0]];

  for (var i = 0; i < instructions.length; i++) {
    const { length, direction: dir } = instructions[i];
    if (!(dir == "R" || dir == "L" || dir == "U" || dir == "D"))
      throw new Error();

    const nextPoint = getNextPoint([y1, x1], dir, length);

    points.push(nextPoint);
    [y1, x1] = nextPoint;
  }
  return points;
}

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

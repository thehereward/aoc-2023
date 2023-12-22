import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data: any[] = readFile("input");
data = data.map((line) => line.split("~"));
const blocks: number[][][] = data.map((line) =>
  line.map((l: string) => l.split(",").map((c) => parseInt(c)))
);
blocks.sort((a, b) => a[0][2] - b[0][2]);

blocks.forEach((block) => {
  const [start, end] = block;
  if (start[0] > end[0]) throw new Error();
  if (start[1] > end[1]) throw new Error();
  if (start[2] > end[2]) throw new Error();
});

var xMin = Infinity;
var xMax = -Infinity;
var yMin = Infinity;
var yMax = -Infinity;
var zMin = Infinity;
var zMax = -Infinity;

blocks.forEach((block) => {
  const [start, end] = block;
  xMin = Math.min(start[0], end[0], xMin);
  xMax = Math.max(start[0], end[0], xMax);
  yMin = Math.min(start[1], end[1], yMin);
  yMax = Math.max(start[1], end[1], yMax);
  zMin = Math.min(start[2], end[2], zMin);
  zMax = Math.max(start[2], end[2], zMax);
});

const ground = [
  [xMin, yMin, 0],
  [xMax, yMax, 0],
];

function cubesIntersect(a: number[][], b: number[][]): boolean {
  //   Determining overlap in the x plane
  const overlapX = a[1][0] >= b[0][0] && a[0][0] <= b[1][0];
  //   Determining overlap in the y plane
  const overlapY = a[1][1] >= b[0][1] && a[0][1] <= b[1][1];
  //   Determining overlap in the z plane
  const overlapZ = a[1][2] >= b[0][2] && a[0][2] <= b[1][2];

  //   console.log(a, b);
  //   console.log({ overlapX, overlapY, overlapZ });
  return overlapX && overlapY && overlapZ;
}

function cubesSupported(a: number[][], b: number[][]): boolean {
  //   Determining overlap in the x plane
  const overlapX = a[1][0] >= b[0][0] && a[0][0] <= b[1][0];
  //   Determining overlap in the y plane
  const overlapY = a[1][1] >= b[0][1] && a[0][1] <= b[1][1];
  //   Determining just above in the z plane
  const overlapZ = a[0][2] == b[1][2] + 1 || b[0][2] == a[1][2] + 1;

  //   console.log(a, b);
  //   console.log({ overlapX, overlapY, overlapZ });
  return overlapX && overlapY && overlapZ;
}

const settledCubes = [ground];
const supportingCubes: number[][][][] = [];

blocks.forEach((block) => {
  var supporting = settledCubes.filter((a) => cubesSupported(block, a));
  var isSettled = supporting.length > 0;
  while (!isSettled) {
    block = block.map((a) => [a[0], a[1], a[2] - 1]);
    supporting = settledCubes.filter((a) => cubesSupported(block, a));
    isSettled = supporting.length > 0;
  }
  supportingCubes.push(supporting);
  settledCubes.push(block);
});

// settledCubes.shift(); // Remove ground

function onlyUnique(value: any, index: any, array: string | any[]) {
  return array.indexOf(value) === index;
}

const supportingCubeStrings = supportingCubes
  //   .filter((c) => c !== ground)
  .map((s) => s.map((c) => JSON.stringify(c)));
//   .filter(onlyUnique).length;

const essentialCubes = supportingCubeStrings
  .filter((s) => s.length == 1)
  .map((s) => s[0])
  .filter(onlyUnique);

console.log(essentialCubes);

console.log(settledCubes.length - essentialCubes.length);

// console.log(xMin, xMax, yMin, yMax, zMin, zMax);

logTime("Part 1");

logTime("Part 2");

export {};

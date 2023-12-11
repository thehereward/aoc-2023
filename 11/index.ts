import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const printlines = (lines: string[][]) =>
  lines.forEach((line) => console.log(line.join("")));

const logTime = getTimeLogger();

var data = readFile("input");

var lines = data.map((line) => line.split(""));

const numRows = lines.length;
const numColumns = lines[0].length;
const emptyColumns = new Set(get0To(numColumns));
const emptyRows = new Set(get0To(numRows));

lines.forEach((line, rowNumber) => {
  // var isRowEmpty = true
  line.forEach((char, colNum) => {
    if (char == "#") {
      emptyRows.delete(rowNumber);
      emptyColumns.delete(colNum);
    }
  });
});

lines.forEach((line) => {
  var inserted = 0;
  var lastValue = 0;
  emptyColumns.forEach((value) => {
    if (value < lastValue) {
      throw new Error("values out of order");
    }
    line.splice(value + inserted, 0, ".");
    inserted++;
    lastValue = value;
  });
});

const rowProtoype = new Array(lines[0].length).fill(".");

var inserted = 0;
var lastValue = 0;
emptyRows.forEach((value) => {
  if (value < lastValue) {
    throw new Error("values out of order");
  }
  lines.splice(value + inserted, 0, rowProtoype);
  inserted++;
  lastValue = value;
});

const galaxies: number[][] = [];
lines.map((line, y) =>
  line.forEach((char, x) => {
    if (char == "#") {
      galaxies.push([x, y]);
    }
  })
);

const diffs: number[] = [];
do {
  var galaxy = galaxies.shift();
  if (galaxy) {
    const [x, y] = galaxy;
    galaxies.forEach((otherGalaxy) => {
      const [x2, y2] = otherGalaxy;
      const diff = Math.abs(x2 - x) + Math.abs(y2 - y);
      diffs.push(diff);
    });
  }
} while (galaxies.length > 0);

console.log(diffs.reduce(sum));
// printlines(lines);

logTime("Part 1");

logTime("Part 2");

export {};

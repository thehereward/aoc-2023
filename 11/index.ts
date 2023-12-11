import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { isInRange } from "../common/range";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

var lines = data.map((line) => line.split(""));

const numRows = lines.length;
const numColumns = lines[0].length;
const emptyColumns = new Set(get0To(numColumns));
const emptyRows = new Set(get0To(numRows));

lines.forEach((line, rowNumber) => {
  line.forEach((char, colNum) => {
    if (char == "#") {
      emptyRows.delete(rowNumber);
      emptyColumns.delete(colNum);
    }
  });
});

const cols = Array.from(emptyColumns);
const rows = Array.from(emptyRows);

const galaxies: number[][] = [];
lines.map((line, y) =>
  line.forEach((char, x) => {
    if (char == "#") {
      galaxies.push([x, y]);
    }
  })
);

const part1: number[] = getDistances(JSON.parse(JSON.stringify(galaxies)), 2);
console.log(part1.reduce(sum));

logTime("Part 1");

const expansion = 1000000;
const part2: number[] = getDistances(
  JSON.parse(JSON.stringify(galaxies)),
  expansion
);
console.log(part2.reduce(sum));
logTime("Part 2");

export {};

function calcDistance(
  x: number,
  x2: number,
  empties: number,
  expansion: number
) {
  return Math.abs(x2 - x) + (expansion - 1) * empties;
}

function getDistances(galaxies: number[][], expansion: number) {
  const diffs: number[] = [];
  do {
    var galaxy = galaxies.shift();
    if (galaxy) {
      const [x, y] = galaxy;
      galaxies.forEach((otherGalaxy) => {
        const [x2, y2] = otherGalaxy;
        const numberOfEmptyCols = cols.filter((col) =>
          isInRange(col, x, x2)
        ).length;
        const numberOFEmptyRows = rows.filter((row) =>
          isInRange(row, y, y2)
        ).length;

        const diff =
          calcDistance(x, x2, numberOfEmptyCols, expansion) +
          calcDistance(y, y2, numberOFEmptyRows, expansion);
        diffs.push(diff);
      });
    }
  } while (galaxies.length > 0);
  return diffs;
}

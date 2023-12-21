import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3, getNSEW, printGrid } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

const allChars: Map<string, string> = new Map();
const grid: string[][] = [];
var startCoords: number[] = [];
var data = readFile("input");
data.forEach((line, y) => {
  const gridLine: string[] = [];
  line.split("").forEach((char, x) => {
    allChars.set(toKey(x, y), char);
    gridLine.push(char);
    if (char == "S") {
      startCoords = [y, x];
    }
  });
  grid.push(gridLine);
});
console.log({ startCoords });

const yMax = grid.length;
const xMax = grid[0].length;

var locations = [startCoords];
const LIMIT = 64;

for (var count = 0; count < LIMIT; count++) {
  locations = getUnique(locations);
  //   console.log(count, locations);
  locations = locations.flatMap((location) => {
    var nextSteps = getNSEW(location[1], location[0]);
    // console.log(count, nextSteps);
    nextSteps = nextSteps.filter((place) => {
      const [y, x] = place;
      if (y < 0 || x < 0 || y > yMax || x > xMax) {
        return false;
      } else {
        return true;
      }
    });
    // console.log(count, nextSteps);
    nextSteps = nextSteps.filter((place) => {
      const [y, x] = place;
      const atLoc = allChars.get(toKey(x, y));
      return atLoc != "#";
    });
    // console.log(count, nextSteps);
    return nextSteps;
  });
}

locations = getUnique(locations);

locations.forEach((location) => {
  allChars.set(toKey(location[1], location[0]), "O");
});

// printGrid(allChars, xMax, yMax);

console.log(locations.length);

logTime("Part 1");

logTime("Part 2");

export {};

function getUnique(locations: number[][]) {
  return [...new Set(locations.map((p) => toKey(p[0], p[1])))].map((k) =>
    k.split("|").map((c) => parseInt(c))
  );
}

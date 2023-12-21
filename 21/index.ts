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

const LIMIT = 64;

var part1 = runForStepsPart1(LIMIT);

part1 = getUnique(part1);

console.log(part1.length);

logTime("Part 1");

console.log(6, 16, runForStepsPart2(6));
logTime();
console.log(10, 50, runForStepsPart2(10));
logTime();
console.log(50, 1594, runForStepsPart2(50));
logTime();
console.log(100, 6536, runForStepsPart2(100));
// logTime();
// console.log(500, 167004, runForStepsPart2(500));
// console.log(1000, 668697, runForStepsPart2(1000));
// console.log(5000, 16733044, runForStepsPart2(5000));

logTime("Part 2");
export {};

function runForStepsPart1(limit: number) {
  var locations = [startCoords];
  for (var count = 0; count < limit; count++) {
    locations = locations.flatMap((location) => {
      return getNextStepsPart1(location);
    });
    locations = getUnique(locations);
  }
  return locations;
}

function getNextStepsPart1(location: number[]) {
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
}

type Location = {
  x: number;
  y: number;
  grids: number[][];
};

function runForStepsPart2(limit: number) {
  var locations: Location[] = [
    {
      x: startCoords[1],
      y: startCoords[0],
      grids: [[0, 0]],
    },
  ];
  for (var count = 0; count < limit; count++) {
    // console.log(count, locations.length);
    // locations.sort((a, b) => a.x - b.x);
    // locations.forEach((c) => console.log(c));
    locations = locations.flatMap((location) => {
      return getNextStepsPart2(location);
    });
    locations = getUniqueLocations(locations);
  }
  locations.sort((a, b) => a.x - b.x);
  //   console.log(locations.length);
  //   locations.forEach((c) => console.log(c));
  return locations.map((location) => location.grids.length).reduce(sum);
}

function getNextStepsPart2(location: Location) {
  const nextSteps = getNSEW(location.x, location.y);

  var nextLocations: Location[] = nextSteps.map((place) => {
    const [y, x] = place;
    if (y < 0) {
      //   console.log(x, y, location, place);
      return {
        x,
        y: (y + yMax) % yMax,
        grids: location.grids.map((g) => [g[0], g[1] - 1]),
      };
    }
    if (x < 0) {
      const newX = (x + xMax) % xMax;
      //   console.log(x, y, location, place, newX);
      return {
        x: newX,
        y,
        grids: location.grids.map((g) => [g[0] - 1, g[1]]),
      };
    }
    if (y >= yMax) {
      //   console.log(x, y, location, place);
      return {
        x,
        y: y % yMax,
        grids: location.grids.map((g) => [g[0], g[1] + 1]),
      };
    }
    if (x >= xMax) {
      //   console.log(x, y, location, place);
      return {
        x: x % xMax,
        y,
        grids: location.grids.map((g) => [g[0] + 1, g[1]]),
      };
    }
    return {
      x,
      y,
      grids: location.grids,
    };
  });
  // console.log(count, nextSteps);
  nextLocations = nextLocations.filter((place) => {
    const { y, x } = place;
    const atLoc = allChars.get(toKey(x, y));
    return atLoc != "#";
  });
  // console.log(count, nextSteps);
  return nextLocations;
}

function getUnique(locations: number[][]) {
  return [...new Set(locations.map((p) => toKey(p[0], p[1])))].map((k) =>
    k.split("|").map((c) => parseInt(c))
  );
}

function getUniqueLocations(locations: Location[]): Location[] {
  const s: Map<string, string[]> = new Map();
  locations.forEach((location) => {
    const key = toKey(location.x, location.y);
    const existing = s.get(key);
    if (!existing) {
      s.set(
        key,
        location.grids.map((g) => toKey(g[0], g[1]))
      );
    } else {
      existing.push(...location.grids.map((g) => toKey(g[0], g[1])));
      s.set(key, [...new Set(existing)]);
    }
  });
  const returns: Location[] = [];
  s.forEach((value, key) => {
    const [x, y] = key.split("|");
    returns.push({
      x: parseInt(x),
      y: parseInt(y),
      grids: value.map((k) => k.split("|").map((c) => parseInt(c))),
    });
  });
  return returns;
}

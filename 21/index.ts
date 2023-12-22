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

// console.log(6, 16, runForStepsPart2(6));
// logTime();
// console.log(10, 50, runForStepsPart2(10));
// logTime();
// console.log(50, 1594, runForStepsPart2(50));
// logTime();
// console.log(100, 6536, runForStepsPart2(100));
// logTime();
// console.log(500, 167004, runForStepsPart2(500));
// logTime();
// console.log(1000, 668697, runForStepsPart2(1000));
// logTime();
// console.log(5000, 16733044, runForStepsPart2(5000));

// const part2 = runForStepsPart2(26501365);
// console.log(part2);

const stepsToEdge = Math.floor(xMax / 2);
const stepsToGo = stepsToEdge + xMax * 0;
console.log({ xMax });
runForStepsPart2(stepsToGo);

const gridSize = allChars.size;
var numberOfRocks = 0;
allChars.forEach(
  (value) => (numberOfRocks = numberOfRocks + (value == "#" ? 1 : 0))
);
var numberofFields = 0;
allChars.forEach(
  (value) => (numberofFields = numberofFields + (value != "#" ? 1 : 0))
);
const numberOfSpaces = gridSize - numberOfRocks;

console.log(gridSize);
console.log(numberOfRocks);
console.log(numberOfSpaces);
console.log(numberofFields);

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
  grids: number[];
};

function runForStepsPart2(limit: number) {
  var oddLocations: Map<string, Location> = new Map();
  var evenLocations: Map<string, Location> = new Map();
  var newLocations = [
    {
      x: startCoords[1],
      y: startCoords[0],
      grids: [0],
    },
  ];
  for (var count = 0; count < limit; count++) {
    // if (count % 100 == 0) {
    //   console.log("");
    //   logGrid(oddLocations, 0, evenLocations, count);
    //   logGrid(oddLocations, 1, evenLocations, count);
    //   logGrid(oddLocations, -1, evenLocations, count);
    //   logGrid(oddLocations, 1000, evenLocations, count);
    //   logGrid(oddLocations, -1000, evenLocations, count);

    //   logGrid(oddLocations, 1001, evenLocations, count);
    //   logGrid(oddLocations, 999, evenLocations, count);
    //   logGrid(oddLocations, -999, evenLocations, count);
    //   logGrid(oddLocations, -1001, evenLocations, count);

    //   logGrid(oddLocations, 4000, evenLocations, count);
    //   logGrid(oddLocations, 5000, evenLocations, count);
    //   logGrid(oddLocations, 6000, evenLocations, count);
    //   logGrid(oddLocations, 7000, evenLocations, count);
    // }
    var existingLocations = count % 2 == 0 ? oddLocations : evenLocations;
    // console.log(count);
    // locations.sort((a, b) => a.x - b.x);
    // locations.forEach((c) => console.log(c));
    var nextLocations = newLocations.flatMap((location) => {
      return getNextStepsPart2(location);
    });
    nextLocations = [
      ...new Set(nextLocations.map((m) => JSON.stringify(m))),
    ].map((p) => JSON.parse(p));

    const newSet: Map<string, Set<number>> = new Map();
    nextLocations.forEach((location) => {
      const key = toKey(location.x, location.y);
      if (!newSet.has(key)) {
        newSet.set(key, new Set());
      }
      const n = newSet.get(key);
      if (!n) throw new Error();
      location.grids.forEach((grid) => n.add(grid));
    });
    nextLocations = [];

    newSet.forEach((value, key) => {
      const [x, y] = key.split("|").map((p) => parseInt(p));
      nextLocations.push({
        x,
        y,
        grids: [...value],
      });
    });

    // nextLocations = [
    //   ...new Set(nextLocations.map((m) => JSON.stringify(m))),
    // ].map((p) => JSON.parse(p));
    // console.log("");
    // console.log({ existingLocations });
    // console.log({ nextLocations });
    var t = false;
    newLocations = nextLocations.filter((loc) => {
      const key = toKey(loc.x, loc.y);
      if (!existingLocations.has(key)) {
        // console.log("new key");
        return true;
      }
      //   else {
      //     return false;
      //   }
      const existing = existingLocations.get(key);
      if (!existing) throw new Error("Seriously");
      //   if (loc.grids.length > 1) console.log("There were more than 1 grid");
      //   console.log(loc.grids);
      loc.grids = loc.grids.filter(
        (g) => existing.grids.findIndex((p) => g == p) == -1
      );
      if (loc.grids.length > 0) {
        // t = count > 100 ? true : false;
        return true;
      } else {
        return false;
      }
    });
    if (t) {
      console.log("");
      console.log(newLocations);
      console.log(newLocations.length);
      console.log(newLocations.map((l) => l.grids.length).reduce(sum));
      //   console.log(existingLocations);
      break;
    }
    // if (count % 100 == 0) {
    //   logTime(`${count} ${newLocations.length}`);
    // }
    nextLocations.forEach((loc) => {
      var existing = existingLocations.get(toKey(loc.x, loc.y));
      if (!existing) {
        existing = {
          x: loc.x,
          y: loc.y,
          grids: [...loc.grids],
        };
        existingLocations.set(toKey(existing.x, existing.y), existing);
      }
      existing.grids.push(...loc.grids);
      existing.grids = [...new Set(existing.grids)];
    });
  }
  var locations = limit % 2 == 0 ? evenLocations : oddLocations;

  const gridsMap: Map<number, Set<string>> = new Map();
  locations.forEach((loc) => {
    const { x, y, grids } = loc;
    const key = toKey(x, y);
    grids.forEach((grid) => {
      if (!gridsMap.has(grid)) {
        gridsMap.set(grid, new Set());
      }
      const s = gridsMap.get(grid);
      if (!s) throw new Error();
      s.add(key);
    });
  });

  gridsMap.forEach((_, key) => {
    logGridSize(gridsMap, key);
  });

  //   console.log(locations);
  var count = 0;
  locations.forEach((loc) => (count = count + loc.grids.length));
  //   locations.sort((a, b) => a.x - b.x);
  //   console.log(locations.length);
  //   locations.forEach((c) => console.log(c));
  return count;
}

function logGridSize(gridsMap: Map<number, Set<string>>, gridRef: number) {
  const s = gridsMap.get(gridRef);
  if (!s) throw new Error();
  const gridString = `${gridRef}`;
  logTime(`${gridString.padStart(6, " ")} | ${s.size}`);
}

function logGrid(
  oddLocations: Map<string, Location>,
  gridRef: number,
  evenLocations: Map<string, Location>,
  count: number
) {
  const { oddCount, evenCount } = getCountFor(
    oddLocations,
    gridRef,
    evenLocations
  );
  logTime(`${count} - ${gridRef} -  ${oddCount} - ${evenCount}`);
}

function getCountFor(
  oddLocations: Map<string, Location>,
  gridRef: number,
  evenLocations: Map<string, Location>
) {
  const odd: Location[] = [];
  oddLocations.forEach((l) => odd.push(l));
  const oddCount = odd.filter((l) => l.grids.indexOf(gridRef) != -1).length;
  const even: Location[] = [];
  evenLocations.forEach((l) => even.push(l));
  const evenCount = even.filter((l) => l.grids.indexOf(gridRef) != -1).length;
  return { oddCount, evenCount };
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
        grids: location.grids.map((g) => g - 1),
      };
    }
    if (x < 0) {
      const newX = (x + xMax) % xMax;
      //   console.log(x, y, location, place, newX);
      return {
        x: newX,
        y,
        grids: location.grids.map((g) => g - 1000),
      };
    }
    if (y >= yMax) {
      //   console.log(x, y, location, place);
      return {
        x,
        y: y % yMax,
        grids: location.grids.map((g) => g + 1),
      };
    }
    if (x >= xMax) {
      //   console.log(x, y, location, place);
      return {
        x: x % xMax,
        y,
        grids: location.grids.map((g) => g + 1000),
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
  const s: Map<string, number[]> = new Map();
  locations.forEach((location) => {
    const key = toKey(location.x, location.y);
    const existing = s.get(key);
    if (!existing) {
      s.set(key, location.grids);
    } else {
      s.set(key, existing.concat(location.grids));
    }
  });
  const returns: Location[] = [];
  s.forEach((value, key) => {
    const [x, y] = key.split("|");
    returns.push({
      x: parseInt(x),
      y: parseInt(y),
      grids: [...new Set(value)],
    });
  });
  return returns;
}

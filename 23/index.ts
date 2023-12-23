import { assertDefined, sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3, getNSEW } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const grid = data.map((line) => line.split(""));

function asKey(point: number[]): string {
  return toKey(point[1], point[0]);
}

const allChars: Map<string, string> = new Map();
grid.forEach((line, y) => {
  line.forEach((char, x) => {
    allChars.set(toKey(x, y), char);
  });
});

const yMax = grid.length;
const xMax = grid[0].length;

const start = [0, 1];
const end = [yMax - 1, xMax - 2];
const endKey = asKey(end);

// console.log({ allChars });

var currentLoc = [1, 1];
var previousLoc = start;
var currentPath = [asKey(previousLoc), asKey(currentLoc)];

const incompletePaths: string[][] = [];
const completePaths: string[][] = [];
while (true) {
  const [y, x] = currentLoc;
  const currentLocKey = asKey(currentLoc);
  //   if (currentLocKey == "3|6") {
  //     console.log(currentLocKey, currentPath);
  //     console.log(incompletePaths);
  //   }
  if (currentLocKey == endKey) {
    // complete!
    completePaths.push(currentPath);
    if (incompletePaths.length == 0) {
      // we're done
      console.log("We're done");
      break;
    } else {
      currentPath = assertDefined(incompletePaths.shift());
      currentLoc = fromKey(currentPath.slice(-1)[0]);
      continue;
    }
  }
  const locChar = assertDefined(allChars.get(currentLocKey));
  var next: number[][];
  switch (locChar) {
    case ">":
      //   console.log(">");
      //   console.log(currentLocKey);
      next = [[y, x + 1]];
      //   console.log(asKey(next[0]));
      //   console.log(currentPath);
      break;
    case "<":
      next = [[y, x - 1]];
      break;
    case "^":
      next = [[y - 1, x]];
      break;
    case "v":
      next = [[y + 1, x]];
      break;
    default:
      next = getNSEW(x, y);
      break;
  }
  next = next.filter((p) => {
    const key = asKey(p);
    return (
      assertDefined(allChars.get(key)) != "#" && currentPath.indexOf(key) == -1
    );
  });
  if (next.length == 0) {
    // dead end, abandon the path
    if (incompletePaths.length == 0) {
      // we're done
      break;
    } else {
      currentPath = assertDefined(incompletePaths.shift());
      currentLoc = fromKey(currentPath.slice(-1)[0]);
      continue;
    }
  } else if (next.length == 1) {
    currentLoc = next[0];
    currentPath.push(asKey(currentLoc));
  } else {
    // options - split the path
    const nextPaths = next.map((n) => [...currentPath, asKey(n)]);
    incompletePaths.push(...nextPaths);
    currentPath = assertDefined(incompletePaths.shift());
    currentLoc = fromKey(currentPath.slice(-1)[0]);
    continue;
  }
}

console.log(completePaths.map((m) => m.length - 1).sort((a, b) => b - a)[0]);

logTime("Part 1");

logTime("Part 2");

export {};

function fromKey(latest: string): number[] {
  const [x, y] = latest.split("|").map((c) => parseInt(c));
  return [y, x];
}

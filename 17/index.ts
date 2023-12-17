import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3, getNSEW } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const lines = data.map((line) => line.split("").map((char) => parseInt(char)));

const xMax = lines[0].length;
const yMax = lines.length;

const costs: number[][] = [];

type T = {
  coords: number[];
  costToEnter: number;
  totalCost: number;
  key: string;
  paths: string[];
};
const unvisited: T[] = [];
const allNodes: T[] = [];
const nodeMap: Map<string, T> = new Map();

lines.forEach((line, y) => {
  const costLine: number[] = [];
  line.forEach((_, x) => {
    costLine[x] = Infinity;
    const newNode = {
      coords: [y, x],
      costToEnter: lines[y][x],
      totalCost: x == 0 && y == 0 ? 0 : Infinity,
      key: toKey(x, y),
      paths: x == 0 && y == 0 ? [""] : [],
    };
    allNodes.push(newNode);
    unvisited.push(newNode);
    nodeMap.set(newNode.key, newNode);
  });
  costs.push(costLine);
});

type DIRECTION = "^" | "v" | ">" | "<";
const DIRECTIONS = ["^", "v", ">", "<"];

const visited: Set<string> = new Set();

costs[0][0] = 0;

const cost = lines[([0, 0][0], [0, 0][1])];

var count = 0;

function visitNode(start: T) {
  count++;
  const { coords, paths, totalCost } = start;
  visited.add(toKey(coords[1], coords[0]));

  const neighbours = getNSEW(coords[1], coords[0]).map((n, i) => {
    return { coords: n, newDirection: DIRECTIONS[i] };
  });

  //   const lastDirections = paths.map((path) => path.slice(-1));
  const nodesInMap = neighbours.filter((node) => {
    const [y, x] = node.coords;
    if (y < 0 || x < 0 || y >= yMax || x >= xMax) return false;

    if (visited.has(toKey(x, y))) return false;
    // if (lastDirections.length == 1) {
    //   const lastDirection = lastDirections[0];
    //   switch (lastDirection) {
    //     case "^":
    //       return node.newDirection != "v";
    //     case "v":
    //       return node.newDirection != "^";
    //     case ">":
    //       return node.newDirection != "<";
    //     case "<":
    //       return node.newDirection != ">";
    //     default:
    //       return true;
    //   }
    // }
    return true;
  });

  const nodesWithPaths = nodesInMap.flatMap((node) => {
    return paths.map((path) => {
      return {
        coords: node.coords,
        path: path + node.newDirection,
      };
    });
  });

  const costed = nodesWithPaths.map((node) => {
    const { coords } = node;
    const cost = lines[coords[0]][coords[1]];
    return {
      ...node,
      cost,
    };
  });

  //   console.log(costed);
  const final = costed.map((node) => {
    return {
      ...node,
      cost: node.cost + totalCost,
    };
  });

  const valids = final.filter((node) => isValidPath(node.path));
  //   console.log(valids);

  //   console.log(start);
  //   console.log(valids);

  //   if (count > 3) {
  //     throw new Error();
  //   }

  valids.forEach((node) => {
    const { coords, cost, path } = node;
    const key = toKey(coords[1], coords[0]);
    const mainNode = nodeMap.get(key);

    if (!!mainNode) {
      //   if (cost == mainNode.totalCost) {
      //     // console.log("found multiple ways to access cell at same cost");
      //     // console.log(coords);
      //     // console.log(mainNode.path);
      //     // console.log(path);
      //     if (isRejectable(path)) {
      //       console.log("was rejectable");
      //       unvisited.push(mainNode);
      //     }
      //   }

      const isNewMin = cost != mainNode.totalCost;
      mainNode.totalCost = Math.min(cost, mainNode.totalCost);
      if (isNewMin) {
        mainNode.paths = [path];
      } else {
        mainNode.paths.push(path);
      }
    }
  });
}

function isRejectable(path: string) {
  return !isValidPath(path);
}

function isValidPath(path: string) {
  if (path.length < 2) {
    return true;
  }

  const lastTwo = path.slice(-2);
  if (
    lastTwo == "><" ||
    lastTwo == "><" ||
    lastTwo == "v^" ||
    lastTwo == "^v"
  ) {
    return false;
  }

  if (path.length < 4) {
    return true;
  }

  const section = path.slice(-4);
  if (
    section == ">>>>" ||
    section == "<<<<" ||
    section == "vvvv" ||
    section == "^^^^"
  ) {
    return false;
  } else {
    return true;
  }
}

// var toVisit = [start];
var count = 0;
while (unvisited.length > 0) {
  //   console.log(toVisit);
  unvisited.sort((a, b) => a.totalCost - b.totalCost);
  //   console.log(unvisited.filter((a) => a.totalCost != Infinity).slice(0, 10));
  //   console.log(toVisit);
  const next = unvisited.shift();
  //   console.log(next);
  if (!next) {
    throw new Error();
  }
  visitNode(next);
  count++;
}

console.log(nodeMap.get(toKey(xMax - 1, yMax - 1)));

// lines.forEach((line, y) => {
//   const costLine: string[] = [];
//   line.forEach((_, x) => {
//     costLine[x] = visited.has(toKey(x, y)) ? "X" : ".";
//   });
//   console.log(costLine.join(""));
// });

logTime("Part 1");

logTime("Part 2");

export {};

// Correct Path
// >>v>>>^>>>vv>>vv>vvv>vvv<vv>
// >>>v>>>v>vv>>>vvv>v>vv<vv>
// >>>v>>>v>vv>>>vvv>v>vvv<v>

// >>v>>^>>>v>>v>vv>v>vvv<v>vvv
// >>v>>^>>v>>>v>vv>v>vvv<v>vvv
// >>v>>^>>>v>v>>vv>v>vvv<v>vvv
// >>v>>^>>v>>v>>vv>v>vvv<v>vvv

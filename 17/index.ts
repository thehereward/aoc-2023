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

type Cost = {
  cost: number;
  path: string;
};

type T = {
  coords: number[];
  costToEnter: number;
  key: string;
  paths: Cost[];
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
      key: toKey(x, y),
      paths:
        x == 0 && y == 0
          ? [
              {
                cost: 0,
                path: "",
              },
            ]
          : [],
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

function visitNode(currentNode: T) {
  //   console.log("");
  //   console.log(currentNode);
  const { coords, paths, costToEnter } = currentNode;
  visited.add(toKey(coords[1], coords[0]));

  const neighbours = getNSEW(coords[1], coords[0]).map((n, i) => {
    return { coords: n, newDirection: DIRECTIONS[i] };
  });
  const nodesInMap = neighbours.filter((node) => {
    const [y, x] = node.coords;
    return y < 0 || x < 0 || y >= yMax || x >= xMax ? false : true;
  });

  const nodesWithCosts = nodesInMap.map((node) => {
    const { coords } = node;
    const cost = lines[coords[0]][coords[1]];
    return {
      coords: coords,
      key: toKey(coords[1], coords[0]),
      newDirection: node.newDirection,
      cost,
    };
  });

  const newNodes = nodesWithCosts.map((node) => {
    const newPaths: Cost[] = [];

    paths.forEach((costPath) => {
      const { cost, path } = costPath;
      newPaths.push({
        path: path + node.newDirection,
        cost: cost + node.cost,
      });
    });
    return {
      //   coords: node.coords,
      key: node.key,
      paths: newPaths,
    };
  });

  newNodes.forEach(
    (node) => (node.paths = node.paths.filter((pc) => isValidPath(pc.path)))
  );

  //   newNodes.forEach((node) => console.log(node));

  newNodes.forEach((node) => {
    const { key, paths } = node;
    const mainNode = nodeMap.get(key);
    if (!mainNode) {
      console.log("Could not find a node");
      throw new Error();
    }
    mainNode.paths.push(...paths);
  });

  //   console.log(valids);

  //   console.log(start);
  //   console.log(valids);

  //   if (count > 3) {
  //     throw new Error();
  //   }

  //   valids.forEach((node) => {
  //     const { coords, cost, path } = node;
  //     const key = toKey(coords[1], coords[0]);
  //     const mainNode = nodeMap.get(key);

  //     if (!!mainNode) {
  //       //   if (cost == mainNode.totalCost) {
  //       //     // console.log("found multiple ways to access cell at same cost");
  //       //     // console.log(coords);
  //       //     // console.log(mainNode.path);
  //       //     // console.log(path);
  //       //     if (isRejectable(path)) {
  //       //       console.log("was rejectable");
  //       //       unvisited.push(mainNode);
  //       //     }
  //       //   }

  //       if (cost < mainNode.totalCost) {
  //         if (visited.has(key)) {
  //           console.log("trying to update a visited node");
  //         }
  //         mainNode.totalCost = cost;
  //         mainNode.paths = [path];
  //       } else if (cost == mainNode.totalCost) {
  //         if (visited.has(key)) {
  //           console.log("trying to update a visited node");
  //         }
  //         mainNode.totalCost = cost;
  //         mainNode.paths.push(path);
  //       }
  //     }
  //   });
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
const LIMIT = Infinity;
var count = 0;
while (unvisited.length > 0) {
  //   unvisited.sort((a, b) => a.totalCost - b.totalCost);
  //   console.log(
  //     unvisited
  //       .filter((a) => a.totalCost != Infinity)
  //       .slice(0, 10)
  //       .map((node) => {
  //         return {
  //           yx: node.coords,
  //           cost: node.costToEnter,
  //           tCost: node.totalCost,
  //           paths: node.paths,
  //         };
  //       })
  //   );
  //   console.log("");
  if (count > LIMIT) {
    break;
  }
  //   console.log(toVisit);
  const next = unvisited.shift();
  //   console.log(next);
  if (!next) {
    throw new Error();
  }
  //   console.log(next);
  visitNode(next);
  count++;
}

// console.log(nodeMap.keys());
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

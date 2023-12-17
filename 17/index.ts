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
const keysToVisit: string[] = [];
const costsToEnter: Map<string, number> = new Map();
const totalCostToPoint: Map<string, number> = new Map();

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
    costsToEnter.set(newNode.key, newNode.costToEnter);
  });
  costs.push(costLine);
});

type Direction = "^" | "v" | ">" | "<";
const DIRECTIONS = ["^", "v", ">", "<"];

const visited: Set<string> = new Set();

costs[0][0] = 0;

type Step = {
  lastDirection: Direction;
  coords: number[];
  cost: number;
};

var states: Step[] = [
  {
    lastDirection: ">",
    coords: [0, 0],
    cost: 0,
  },
  {
    lastDirection: "v",
    coords: [0, 0],
    cost: 0,
  },
];

const MAX_STEPS = 10;
const MIN_STEP = 4;

var printed = false;
function getStepsAbove(step: Step) {
  const increments = get0To(MAX_STEPS).map((i) => i + 1);
  const [y, x] = step.coords;
  switch (step.lastDirection) {
    case "<":
    case ">":
      return increments.flatMap((increment) => [[y + increment, x]]);
    case "^":
    case "v":
      return increments.flatMap((increment) => [[y, x + increment]]);
  }
}

function getStepsBelow(step: Step) {
  const increments = get0To(MAX_STEPS).map((i) => i + 1);
  const [y, x] = step.coords;
  switch (step.lastDirection) {
    case "<":
    case ">":
      return increments.flatMap((increment) => [[y - increment, x]]);
    case "^":
    case "v":
      return increments.flatMap((increment) => [[y, x - increment]]);
  }
}

function getNextStates(state: Step): Step[] {
  const stepsAbove = getStepsAbove(state).filter((step) => {
    const [y, x] = step;
    return y < 0 || x < 0 || y >= yMax || x >= xMax ? false : true;
  });
  const stepsBelow = getStepsBelow(state).filter((step) => {
    const [y, x] = step;
    return y < 0 || x < 0 || y >= yMax || x >= xMax ? false : true;
  });
  const costsAbove = stepsAbove.map((step) => {
    const [y, x] = step;
    const key = toKey(x, y);
    const cost = costsToEnter.get(key);
    if (!cost) {
      throw new Error();
    }
    return cost;
  });
  var acc = 0;
  const accCostsAbove = costsAbove.map((cost) => {
    acc = cost + acc;
    return acc;
  });

  const costsBelow = stepsBelow.map((step) => {
    const [y, x] = step;
    const key = toKey(x, y);
    const cost = costsToEnter.get(key);
    if (!cost) {
      throw new Error();
    }
    return cost;
  });
  acc = 0;
  const accCostsBelow = costsBelow.map((cost) => {
    acc = cost + acc;
    return acc;
  });

  //   console.log(stepsAbove);
  //   console.log(costsAbove);
  //   console.log(accCostsAbove);

  //   //   if (stepsBelow.length > 1) {
  //   //     console.log(state);
  //   console.log(stepsBelow);
  //   console.log(costsBelow);
  //   console.log(accCostsBelow);
  //   }
  const nextDirection: Direction = state.lastDirection == ">" ? "v" : ">";
  const newStepsAbove = stepsAbove
    .map((next, i) => {
      return {
        lastDirection: nextDirection,
        coords: next,
        cost: state.cost + accCostsAbove[i],
      };
    })
    .filter((_, i) => i >= MIN_STEP - 1);
  const newStepsBelow = stepsBelow
    .map((next, i) => {
      return {
        lastDirection: nextDirection,
        coords: next,
        cost: state.cost + accCostsBelow[i],
      };
    })
    .filter((_, i) => i >= MIN_STEP - 1);
  return [...newStepsAbove, ...newStepsBelow];
}

var count = 0;
const COUNT = Infinity;
while (states.length > 0) {
  //   console.log(states);
  const state = states.shift();
  if (!state) {
    throw new Error();
  }
  if (count > COUNT) {
    console.log(state);
  }
  const newStates = getNextStates(state);
  if (count > COUNT) {
    console.log(newStates);
  }
  newStates.forEach((state) => {
    const key = `${state.lastDirection}-${toKey(
      state.coords[1],
      state.coords[0]
    )}`;
    const cost = totalCostToPoint.get(key);
    if (cost == undefined || state.cost < cost) {
      totalCostToPoint.set(key, state.cost);
      states.push(state);
    }
  });
  states.sort((a, b) => a.cost - b.cost);
  if (count > COUNT) {
    console.log(states);
  }
  if (count > COUNT + 1) {
    break;
  }
  count++;
  //   break;
}

console.log(totalCostToPoint.get(`v-${toKey(xMax - 1, yMax - 1)}`));
console.log(totalCostToPoint.get(`>-${toKey(xMax - 1, yMax - 1)}`));

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

// const LIMIT = Infinity;
// var count = 0;
// while (unvisited.length > 0) {
//   //   unvisited.sort((a, b) => a.totalCost - b.totalCost);
//   //   console.log(
//   //     unvisited
//   //       .filter((a) => a.totalCost != Infinity)
//   //       .slice(0, 10)
//   //       .map((node) => {
//   //         return {
//   //           yx: node.coords,
//   //           cost: node.costToEnter,
//   //           tCost: node.totalCost,
//   //           paths: node.paths,
//   //         };
//   //       })
//   //   );
//   //   console.log("");
//   if (count > LIMIT) {
//     break;
//   }
//   //   console.log(toVisit);
//   const next = unvisited.shift();
//   //   console.log(next);
//   if (!next) {
//     throw new Error();
//   }
//   //   console.log(next);
//   visitNode(next);
//   count++;
// }

// console.log(nodeMap.keys());
// console.log(nodeMap.get(toKey(xMax - 1, yMax - 1)));

type C = {
  coords: number[];
  cost: number;
  history: string[];
  path: string[];
};

const start: C = {
  coords: [0, 0],
  cost: 0,
  history: [],
  path: [],
};

const endKey = toKey(xMax - 1, yMax - 1);
const locs = [start];
const routesToEnd: C[] = [];
var maxCost = Infinity;

// while (locs.length > 0) {
//   locs.sort((a, b) => b.path.length - a.path.length);
//   const loc = locs.shift();
//   if (!loc) {
//     throw new Error();
//   }
//   locs.push(...getNewlocs(loc));
//   //   console.log(locs);
//   //   logTime(routesToEnd.length.toString());
// }

function getNewlocs(currentNode: C) {
  //   console.log("");
  //   console.log(currentNode);
  const { coords, path, history, cost } = currentNode;
  const key = toKey(coords[1], coords[0]);
  const costToEnter = nodeMap.get(key)?.costToEnter;

  if (costToEnter == undefined) {
    throw new Error();
  }

  if (history.indexOf(key) != -1) {
    // We've been here before, we can stop as this is a deadend
    return [];
  }

  const pathString = path.join("");
  const reverseRegex = /<>|><|v\^|\^v/;
  if (reverseRegex.test(pathString)) {
    // Bad string
    return [];
  }

  const tooMany = />>>>|<<<<|\^\^\^\^|vvvv/;
  if (tooMany.test(pathString)) {
    // Bad string
    return [];
  }

  if (cost > maxCost) {
    // too expensive
    return [];
  }

  // Store the key
  history.push(key);

  if (key == endKey) {
    // We've finished - do something special
    routesToEnd.push(currentNode);
    maxCost = Math.min(cost, maxCost);
    logTime(maxCost.toString());
    return [];
  }

  const neighbours = getNSEW(coords[1], coords[0])
    .map((n, i) => {
      return { coords: n, newDirection: DIRECTIONS[i] };
    })
    .filter((node) => {
      const [y, x] = node.coords;
      return y < 0 || x < 0 || y >= yMax || x >= xMax ? false : true;
    })
    .map((n) => {
      return {
        ...n,
        cost: nodeMap.get(toKey(n.coords[1], n.coords[0]))?.costToEnter,
      };
    });

  const newLocs: C[] = [];

  neighbours.forEach((neighbour) => {
    if (neighbour.cost == undefined) {
      throw new Error();
    }
    newLocs.push({
      coords: neighbour.coords,
      cost: cost + neighbour.cost,
      history: history.join(",").split(","),
      path: [...path, neighbour.newDirection],
    });
  });

  return newLocs;
  //   const nodesWithCosts = neighbours.map((node) => {
  //     const { coords } = node;
  //     const cost = lines[coords[0]][coords[1]];
  //     return {
  //       coords: coords,
  //       key: toKey(coords[1], coords[0]),
  //       newDirection: node.newDirection,
  //       cost,
  //     };
  //   });

  //   const newNodes = nodesWithCosts.map((node) => {
  //     const newPaths: Cost[] = [];

  //     paths.forEach((costPath) => {
  //       const { cost, path } = costPath;
  //       newPaths.push({
  //         path: path + node.newDirection,
  //         cost: cost + node.cost,
  //       });
  //     });
  //     return {
  //       //   coords: node.coords,
  //       key: node.key,
  //       paths: newPaths,
  //     };
  //   });

  //   newNodes.forEach(
  //     (node) => (node.paths = node.paths.filter((pc) => isValidPath(pc.path)))
  //   );

  //   //   newNodes.forEach((node) => console.log(node));

  //   newNodes.forEach((node) => {
  //     const { key, paths } = node;
  //     const mainNode = nodeMap.get(key);
  //     if (!mainNode) {
  //       console.log("Could not find a node");
  //       throw new Error();
  //     }
  //     mainNode.paths.push(...paths);
  //   });
}

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

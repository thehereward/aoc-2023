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

lines.forEach((line, y) => {
  const costLine: number[] = [];
  line.forEach((_, x) => {
    costLine[x] = Infinity;
  });
  costs.push(costLine);
});

type DIRECTION = "^" | "v" | ">" | "<";
const DIRECTIONS = ["^", "v", ">", "<"];

const visited: Set<string> = new Set();

costs[0][0] = 0;

const start = {
  coords: [0, 0],
  cost: 0,
  path: "",
};
type Node = {
  coords: number[];
  path: string;
};

const cost = lines[([0, 0][0], [0, 0][1])];
function visitNode(start: Node) {
  const { coords, path } = start;
  visited.add(toKey(coords[1], coords[0]));
  const startCost = costs[coords[0]][coords[1]];
  const neighbours = getNSEW(coords[1], coords[0]).map((n, i) => {
    return { coords: n, path: DIRECTIONS[i] };
  });

  const lastDirection = path.slice(-1);
  const nodesInMap = neighbours.filter((node) => {
    const [y, x] = node.coords;
    if (y < 0 || x < 0 || y >= yMax || x >= xMax) return false;

    if (visited.has(toKey(x, y))) return false;

    switch (lastDirection) {
      case "^":
        return node.path != "v";
      case "v":
        return node.path != "^";
      case ">":
        return node.path != "<";
      case "<":
        return node.path != ">";
      default:
        return true;
    }
  });

  //   console.log(nodesInMap);

  const costed = nodesInMap.map((node) => {
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
      path: path + node.path,
      cost: node.cost + startCost,
    };
  });

  const valids = final.filter((node) => rejectString(node.path));

  valids.forEach((node) => {
    const { coords, cost } = node;
    costs[coords[0]][coords[1]] = Math.min(cost, costs[coords[0]][coords[1]]);
  });

  return valids;
}

function rejectString(path: string) {
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

var toVisit = [start];
while (toVisit.length > 0) {
  //   console.log(toVisit);
  toVisit.sort((a, b) => a.cost - b.cost);
  //   console.log(toVisit);
  const next = toVisit.shift();
  //   console.log(next);
  if (!next) {
    throw new Error();
  }
  toVisit.push(...visitNode(next));
  logTime(toVisit.length.toString());
}

console.log(costs);

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

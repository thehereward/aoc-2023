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

var MAX_STEPS = 3;
var MIN_STEP = 1;

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

const part1Sim: Map<string, number> = runSimulation();

const part1 = Math.min(
  part1Sim.get(`v-${toKey(xMax - 1, yMax - 1)}`) || Infinity,
  part1Sim.get(`>-${toKey(xMax - 1, yMax - 1)}`) || Infinity
);

console.log({ part1 });

logTime("Part 1");

MAX_STEPS = 10;
MIN_STEP = 4;

const part2Sim: Map<string, number> = runSimulation();

const part2 = Math.min(
  part2Sim.get(`v-${toKey(xMax - 1, yMax - 1)}`) || Infinity,
  part2Sim.get(`>-${toKey(xMax - 1, yMax - 1)}`) || Infinity
);

console.log({ part2 });

logTime("Part 2");

export {};
function runSimulation() {
  const totalCostToPoint: Map<string, number> = new Map();
  while (states.length > 0) {
    const state = states.shift();
    if (!state) {
      throw new Error();
    }

    const newStates = getNextStates(state);
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
  }
  return totalCostToPoint;
}

import { sum } from "../common";
import { readFile, getTimeLogger, printlines } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

const lines = data.map((line) => line.split(""));

const everything: Record<string, string> = {};
lines.forEach((line, y) => {
  line.forEach((char, x) => {
    everything[toKey(x, y)] = char;
  });
});

const yMax = lines.length;
const xMax = lines[0].length;

function tiltNorth() {
  for (var y = 0; y < yMax; y++) {
    for (var x = 0; x < xMax; x++) {
      const char = lines[y][x];
      if (char == "O") {
        var yIndexOfObstacle = -1;
        for (var seakNorth = y - 1; seakNorth >= 0; seakNorth--) {
          if (lines[seakNorth][x] != ".") {
            yIndexOfObstacle = seakNorth;
            break;
          }
        }
        lines[y][x] = ".";
        lines[yIndexOfObstacle + 1][x] = char;
      }
    }
  }
}

function tiltSouth() {
  for (var y = yMax - 1; y >= 0; y--) {
    for (var x = 0; x < xMax; x++) {
      const char = lines[y][x];
      if (char == "O") {
        var yIndexOfObstacle = yMax;
        for (var seakSouth = y + 1; seakSouth < yMax; seakSouth++) {
          if (lines[seakSouth][x] != ".") {
            yIndexOfObstacle = seakSouth;
            break;
          }
        }
        lines[y][x] = ".";
        lines[yIndexOfObstacle - 1][x] = char;
      }
    }
  }
}

function tiltWest() {
  for (var x = 0; x < xMax; x++) {
    for (var y = 0; y < yMax; y++) {
      const char = lines[y][x];
      if (char == "O") {
        var xIndexOfObstacle = -1;
        for (var seakWest = x - 1; seakWest >= 0; seakWest--) {
          if (lines[y][seakWest] != ".") {
            xIndexOfObstacle = seakWest;
            break;
          }
        }
        lines[y][x] = ".";
        lines[y][xIndexOfObstacle + 1] = char;
      }
    }
  }
}

function tiltEast() {
  for (var x = xMax - 1; x >= 0; x--) {
    for (var y = 0; y < yMax; y++) {
      const char = lines[y][x];
      if (char == "O") {
        var xIndexOfObstacle = yMax;
        for (var seakEast = x + 1; seakEast < xMax; seakEast++) {
          if (lines[y][seakEast] != ".") {
            xIndexOfObstacle = seakEast;
            break;
          }
        }
        lines[y][x] = ".";
        lines[y][xIndexOfObstacle - 1] = char;
      }
    }
  }
}

const state0 = getState();

tiltNorth();

const part1 = getLoad(lines);
console.log({ part1 });

logTime("Part 1");

tiltWest();
tiltSouth();
tiltEast();

var count = 1;

function getLoad(lines: string[][]) {
  return lines
    .map((line) => line.filter((char) => char == "O").length)
    .map((sum, i) => sum * (yMax - i))
    .reduce(sum);
}

function getState() {
  return lines.map((line) => line.join("")).join("");
}

const stateMap = new Map<string, string>();

const state1 = getState();
stateMap.set(state0, state1);
const stateArray = [state0, state1];

var lastState = state1;
var index = -1;
for (count = 1; count < 1000000000; count++) {
  if (lastState == "") {
    throw new Error();
  }

  if (!stateMap.has(lastState)) {
    tiltNorth();
    tiltWest();
    tiltSouth();
    tiltEast();
    const newState = getState();
    stateMap.set(lastState, newState);
    index = stateArray.findIndex((s) => s == newState);
    if (index != -1) {
      //   console.log("found the repeat");
      //   console.log(newState);
      break;
    }
    stateArray.push(newState);
  }
  lastState = stateMap.get(lastState) || "";
  if (count % 10000000 == 0) {
    logTime(`Complete cycles: ${count}`);
  }
}

var toGo = 1000000000;

// Remove that which came before
toGo = toGo - index;

// Skip a lot of cycles
const cycle = stateArray.length - index;
toGo = toGo % cycle;

// console.log({ toGo });
const finalIndex = toGo + index;

const finalState = stateArray[finalIndex];
// console.log(stateArray.length);
// console.log({ count, index });

const reg = new RegExp(`.{${xMax}}`, "g");
// console.log({ reg });
const matches = finalState.match(reg);

if (!matches) {
  throw Error();
}

const newLines = matches?.map((line) => line.split(""));
// console.log(lastState);
// console.log("");
// printlines(newLines);

const part2 = getLoad(newLines);

console.log({ part2 });

logTime("Part 2");

export {};

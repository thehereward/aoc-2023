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
// console.log(yMax, xMax);

// printlines(lines);

// console.log("");

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

tiltNorth();

const part1 = lines
  .map((line) => line.filter((char) => char == "O").length)
  .map((sum, i) => sum * (yMax - i))
  .reduce(sum);
console.log(part1);

// console.log({ everything });

logTime("Part 1");

tiltWest();
tiltSouth();
tiltEast();

var count = 1;

function getState() {
  const state = lines.map((line) => line.join("")).join("");
}

for (count = 1; count < 1000000000; count++) {
  tiltNorth();
  tiltWest();
  tiltSouth();
  tiltEast();
  if (count % 1000000 == 0) {
    logTime(`Completed cycles: ${count}`);
  }
}

logTime(`After cycles: ${count}`);
printlines(lines);

logTime("Part 2");

export {};

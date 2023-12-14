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

for (var y = 0; y < yMax; y++) {
  for (var x = 0; x < xMax; x++) {
    const char = lines[y][x];
    if (char == "O") {
      //   console.log(x, y, char);

      var yIndexOfObstacle = -1;
      for (var seakNorth = y - 1; seakNorth >= 0; seakNorth--) {
        //   console.log(y, seakNorth);
        if (lines[seakNorth][x] != ".") {
          yIndexOfObstacle = seakNorth;
          break;
        }
      }
      lines[y][x] = ".";
      lines[yIndexOfObstacle + 1][x] = char;
      //   printlines(lines);
      //   console.log("");
      //   console.log(x, y, char, yIndexOfObstacle);
    }
  }
}

const part1 = lines
  .map((line) => line.filter((char) => char == "O").length)
  .map((sum, i) => sum * (yMax - i))
  .reduce(sum);
console.log(part1);
// printlines(lines);

// console.log({ everything });

logTime("Part 1");

logTime("Part 2");

export {};

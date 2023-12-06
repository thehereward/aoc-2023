import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

const times = data[0]
  .split(":")[1]
  .trim()
  .split(" ")
  .map((c) => parseInt(c))
  .filter((n) => !Number.isNaN(n));

const distances = data[1]
  .split(":")[1]
  .trim()
  .split(" ")
  .map((c) => parseInt(c))
  .filter((n) => !Number.isNaN(n));

const races: number[][] = [];
for (var i = 0; i < times.length; i = i + 1) {
  races.push([times[i], distances[i]]);
}

const waysToWinArray: number[] = [];
races.forEach((race) => {
  let waysToWin = 0;
  const [time, recordDistance] = race;
  for (var speed = 0; speed < time; speed = speed + 1) {
    const distance = speed * (time - speed);
    if (distance > recordDistance) {
      waysToWin = waysToWin + 1;
    }
  }
  waysToWinArray.push(waysToWin);
});

console.log({ waysToWinArray });

console.log(waysToWinArray.reduce((a, c) => a * c));

logTime("Part 1");

logTime("Part 2");

export {};

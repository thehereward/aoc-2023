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

const time = parseInt(data[0].split(":")[1].trim().replace(/ /g, ""));
const maxDistance = parseInt(data[1].split(":")[1].trim().replace(/ /g, ""));
console.log({ time, maxDistance });

let waysToWin = 0;
for (var speed = 0; speed < time; speed = speed + 1) {
  const distance = speed * (time - speed);
  if (distance > maxDistance) {
    waysToWin = waysToWin + 1;
  }
}
console.log(waysToWin);

logTime("Part 2");

export {};

import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";
import { findGCD } from "../common/math";

const logTime = getTimeLogger();

var data = readFile("input");

const LRSequence = data[0].split("").map((c) => (c == "L" ? 0 : 1));

data = data.slice(2);
const regex = /^([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\)$/;
const instructions: Record<string, string[]> = {};

data.forEach((line) => {
  const match = line.match(regex);
  if (match) {
    const [_, key, L, R] = match;
    instructions[key] = [L, R];
  }
});

let location = "AAA";
let count1 = 0;

while (location != "ZZZ") {
  location = getNextLocation(location, count1);
  count1 = count1 + 1;
}

console.log(count1);

logTime("Part 1");

const keys = Object.keys(instructions);

const startLocations = keys.filter((k) => k[2] == "A");

const times = startLocations.map((location) => {
  let count = 0;
  const loc: any[][] = [];
  while (true) {
    count = count + 1;
    location = getNextLocation(location, count);
    if (location[2] == "Z") {
      loc.push([location, count]);
    }

    if (loc.length > 1) {
      if (loc[0][0] == location) {
        break;
      }
    }
  }
  return loc.map((p) => p[1]);
});

function getNextLocation(location: string, count: number) {
  return instructions[location][LRSequence[count % LRSequence.length]];
}

const periodsOfLoops = times.map((t) => findGCD(t));
const greatest = findGCD(periodsOfLoops);
const primeFactors = periodsOfLoops.map((n) => n / greatest);
const answer = primeFactors.reduce((a, c) => a * c, greatest);
console.log(answer);

logTime("Part 2");

export {};

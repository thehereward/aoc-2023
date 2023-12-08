import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

const LRSequence = data[0].split("").map((c) => (c == "L" ? 0 : 1));

console.log({ LRSequence });

data = data.slice(2);
const regex = /^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)$/;
const instructions: Record<string, string[]> = {};

data.forEach((line) => {
  const match = line.match(regex);
  if (match) {
    const [_, key, L, R] = match;
    instructions[key] = [L, R];
  }
});

let location = "AAA";
let count = 0;

while (location != "ZZZ") {
  const direction = LRSequence[count % LRSequence.length];
  //   console.log({ location, count, direction });
  location = instructions[location][direction];
  count = count + 1;
  //   if (count > 10) {
  //     break;
  //   }
}

console.log({ count });

logTime("Part 1");

logTime("Part 2");

export {};
